// src/utils/tts-elevenlabs.js

const coachVoices = {
  Rhonda: "ZT9u07TYPVl83ejeLakq",
  Jill: "Clyde2qfp6zPuviqeCOZIE9RZ",
  Scotty: "YXpFCvM1S3JbWEJhoskW",
  Terry: "UgBBYS2sOqTuMpoF3BR0",
  AJ: "CyHwTRKhXEYuSd7CbMwI",
  Chris: "gUABw7pXQjhjt0kNFBTF"
};

function cleanText(text) {
  return text
    .replace(/<[^>]*>?/gm, '') // Remove HTML tags
    .replace(/\*/g, '');       // Remove asterisks
}

export async function speakResponse(text, coachName) {
  if (!coachName || !coachVoices[coachName]) {
    console.warn("No valid coach name passed to speakResponse. Skipping TTS.");
    return;
  }

  const voice = coachVoices[coachName];
  const plainText = cleanText(text);

  try {
    const response = await fetch("https://api.elevenlabs.io/v1/text-to-speech/" + voice, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": "sk_5900056e9ae225f8c8dc0d6b6023d51cf6efd3bb8cb57aca"
      },
      body: JSON.stringify({
        text: plainText,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.4,
          similarity_boost: 0.75
        }
      })
    });

    if (!response.ok) {
      throw new Error("Failed to fetch audio from ElevenLabs: " + response.status);
    }

    const blob = await response.blob();
    const audioUrl = URL.createObjectURL(blob);
    const audio = new Audio(audioUrl);
    audio.play();

  } catch (err) {
    console.error("ElevenLabs TTS error:", err);
  }
} 
