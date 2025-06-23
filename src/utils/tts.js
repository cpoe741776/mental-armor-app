// src/utils/tts.js

const coachVoices = {
  Rhonda: "en-US-Wavenet-C",
  Jill: "en-US-Wavenet-F",
  Scotty: "en-US-Wavenet-B",
  Terry: "en-US-Wavenet-A",
  AJ: "en-US-Wavenet-E"
};

function formatCoachSpeech(text, coachName) {
  const clean = text
    .replace(/<[^>]*>?/gm, '')  // Strip HTML
    .replace(/\*/g, '');       // Remove asterisks

  switch (coachName) {
    case "Rhonda":
      return `<speak><emphasis level="strong">${clean}</emphasis></speak>`;
    case "Jill":
      return `<speak><prosody rate="slow" pitch="+2%">${clean}</prosody></speak>`;
    case "Scotty":
      return `<speak><prosody rate="slow" pitch="-4%" volume="soft">${clean}</prosody><break time="600ms"/></speak>`;
    case "Terry":
      return `<speak><prosody rate="medium">${clean}</prosody><break time="400ms"/></speak>`;
    case "AJ":
      return `<speak><prosody rate="fast" pitch="+2%">${clean}</prosody></speak>`;
    default:
      return `<speak>${clean}</speak>`;
  }
}

export async function speakResponse(text, coachName) {
  if (!coachName || !coachVoices[coachName]) {
    console.warn("No valid coach name passed to speakResponse. Skipping TTS.");
    return;
  }

  const voice = coachVoices[coachName];
  const ssml = formatCoachSpeech(text, coachName);

  try {
    const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=AIzaSyB2qxr51EP6_bmCVzD4nq2SATWUQefbMeM`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
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
    console.log("TTS API Response:", data);

    if (data && data.audioContent) {
      const audioUrl = "data:audio/mp3;base64," + data.audioContent;
      const audio = new Audio(audioUrl);
      audio.play();
    } else {
      console.warn("No audio content returned from TTS.");
    }

  } catch (err) {
    console.error("Text-to-Speech error:", err);
  }
} 
