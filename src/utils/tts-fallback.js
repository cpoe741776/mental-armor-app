import { speakResponse as speakWithElevenLabs } from './elevenlabs_tts';
import { speakResponse as speakWithGoogle } from './tts';

const elevenLabsVoices = ['Rhonda', 'Scotty', 'Jill'];

export async function speakResponse(text, coachName) {
  if (elevenLabsVoices.includes(coachName)) {
    try {
      await speakWithElevenLabs(text, coachName);
      return;
    } catch (err) {
      console.warn("ElevenLabs failed, falling back to Google:", err);
    }
  }

  await speakWithGoogle(text, coachName);
}
