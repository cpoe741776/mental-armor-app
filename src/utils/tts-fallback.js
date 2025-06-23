// src/utils/tts-fallback.js

import { speakResponse as speakWithGoogle } from './tts';
import { speakResponse as speakWithEleven } from './elevenlabs_tts';

const elevenLabsCoaches = ['Rhonda', 'Scotty', 'Jill', 'Chris', 'AJ', 'Terry'];

export async function speakResponse(text, coachName) {
  const useElevenLabs = elevenLabsCoaches.includes(coachName);

  if (!coachName) {
    console.warn("TTS: No coach name provided. Skipping playback.");
    return;
  }

  if (!useElevenLabs) {
    console.warn(`TTS: Coach ${coachName} not assigned to ElevenLabs. Using Google.`);
    return speakWithGoogle(text, coachName);
  }

  try {
    await speakWithEleven(text, coachName);
  } catch (error) {
    console.error("TTS fallback error:", error);

    const quotaError = error?.quota_exceeded || error?.status === 401;

    if (quotaError) {
      console.warn(`Switching ${coachName} to Google TTS due to ElevenLabs quota error.`);
      await speakWithGoogle(text, coachName);
    }
  }
}