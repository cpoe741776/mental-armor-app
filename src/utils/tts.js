// src/utils/tts.js

const coachVoices = {
  Rhonda: "en-US-Wavenet-C", // Bold, female
  Jill: "en-US-Wavenet-F",   // Warm, thoughtful
  Scotty: "en-US-Wavenet-B", // Southern-friendly male
  Terry: "en-US-Wavenet-A",  // Slight edge, Bronx-y
  AJ: "en-US-Wavenet-E",     // Energetic, clear
};

export async function speakResponse(text, coachName) {
  if (!coachName || !coachVoices[coachName]) {
    console.warn("No valid coach name passed to speakResponse. Skipping TTS.");
    return;
  }

  const voice = coachVoices[coachName];

  console.log("TTS is being called...");
  console.log("Voice:", voice);
  console.log("Text:", text);

  try {
    const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=AIzaSyB2qxr51EP6_bmCVzD4nq2SATWUQefbMeM`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        input: { text },
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
