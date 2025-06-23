// src/utils/tts.js

const coachVoices = {
  Terry: "en-US-Wavenet-A",
  AJ: "en-US-Wavenet-E",
  Chris: "en-US-Wavenet-D",
  Rhonda: "en-US-Wavenet-C",
  Scotty: "en-US-Wavenet-F",
  Jill: "en-US-Wavenet-B"
};

// 🔄 Shared utility to strip HTML and special formatting
export function cleanText(text) {
  return text.replace(/<[^>]*>?/gm, '').replace(/\*/g, '');
}

// 🗣️ Adjust voice style based on coach
function formatCoachSpeech(text, coachName) {
  const clean = cleanText(text);

  switch (coachName) {
    case "Terry":
      return `<speak><prosody rate="medium">${clean}</prosody><break time="400ms"/></speak>`;
    case "AJ":
      return `<speak><prosody rate="fast" pitch="+2%">${clean}</prosody></speak>`;
    default:
      return `<speak>${clean}</speak>`;
  }
}

export async function speakResponse(text, coachName) {
  console.log("🔑 GOOGLE TTS KEY AT BUILD TIME:", process.env.REACT_APP_GOOGLE_TTS_KEY);

  if (!coachName || !coachVoices[coachName]) {
    console.warn("TTS: No valid voice available for coach:", coachName);
    return;
  }

  const voice = coachVoices[coachName];
  const ssml = formatCoachSpeech(text, coachName);

  try {
    const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.REACT_APP_GOOGLE_TTS_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: { ssml },
        voice: {
          languageCode: "en-US",
          name: voice
        },
        audioConfig: {
          audioEncoding: "MP3"
        }
      })
    });

    const data = await response.json();

    if (data && data.audioContent) {
      const audioUrl = "data:audio/mp3;base64," + data.audioContent;
      new Audio(audioUrl).play();
    } else {
      console.warn("TTS: No audio content returned from Google.");
    }
  } catch (err) {
    console.error("Google TTS error:", err);
  }
}