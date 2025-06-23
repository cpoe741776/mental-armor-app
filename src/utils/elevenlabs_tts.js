// src/utils/elevenlabs_tts.js

import { cleanText } from './tts';

const coachVoices = {
  Rhonda: "x9leqCOAXOcmC5jtkq65",
  Scotty: "8kvxG72xUMYnIFhZYwWj",
  Jill: "2qfp6zPuviqeCOZIE9RZ",
  Chris: "Xj9Cy2QcfvCkb98YgZ8z",     // ✅ your voice
  AJ: "Yk7T23aNdqPlmZ9CfF5x",       // ✅ AJ's voice
  Terry: "Fm8cJw5XKbNj6vZLP3q2"     // ✅ Terry's voice
};

export async function speakResponse(text, coachName) {
  const voiceId = coachVoices[coachName];

  if (!voiceId) {
    throw new Error(`No ElevenLabs voice ID found for coach: ${coachName}`);
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
    throw new Error(error?.detail?.message || `Failed to fetch audio from ElevenLabs: ${response.status}`);
  }

  const blob = await response.blob();
  const audioUrl = URL.createObjectURL(blob);
  new Audio(audioUrl).play();
}