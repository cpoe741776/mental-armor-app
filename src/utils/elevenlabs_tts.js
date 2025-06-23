// src/utils/elevenlabs_tts.js

import { cleanText } from './tts';

const coachVoices = {
  Rhonda: "x9leqCOAXOcmC5jtkq65",
  Scotty: "8kvxG72xUMYnIFhZYwWj",
  Jill: "2qfp6zPuviqeCOZIE9RZ",
  Chris: "Xj9Cy2QcfvCkb98YgZ8z",
  AJ: "Yk7T23aNdqPlmZ9CfF5x",
  Terry: "Fm8cJw5XKbNj6vZLP3q2"
};

// 🔧 Custom error class for structured throwing
class ElevenLabsError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ElevenLabsError";
    this.status = status;
    this.quota_exceeded = status === 401;
  }
}

export async function speakResponse(text, coachName) {
  const voiceId = coachVoices[coachName];

  if (!voiceId) {
    throw new ElevenLabsError(`No ElevenLabs voice ID found for coach: ${coachName}`, 400);
  }

  const cleanedText = cleanText(text);

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "xi-api-key": process.env.REACT_APP_ELEVENLABS_TTS_KEY
    },
    body: JSON.stringify({
      text: cleanedText,
      model_id: "eleven_monolingual_v1",
      voice_settings: {
        stability: 0.4,
        similarity_boost: 0.75
      }
    })
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("TTS fetch failed:", response.status, error);

    const message = error?.detail?.message || "ElevenLabs TTS error";
    throw new ElevenLabsError(message, response.status);
  }

  const blob = await response.blob();
  const audioUrl = URL.createObjectURL(blob);
  new Audio(audioUrl).play();
}
