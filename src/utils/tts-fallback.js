import { speakResponse as speakWithGoogle } from './tts';
import { speakResponse as speakWithEleven } from './elevenlabs_tts';

const elevenLabsCoaches = ['Rhonda', 'Scotty', 'Jill'];

export async function speakResponse(text, coachName) {
  try {
    if (elevenLabsCoaches.includes(coachName)) {
      await speakWithEleven(text, coachName);
    } else {
      await speakWithGoogle(text, coachName);
    }
  } catch (error) {
    console.error("TTS fallback error:", error);
  }
}