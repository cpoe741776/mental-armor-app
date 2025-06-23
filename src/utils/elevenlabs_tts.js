// src/utils/tts-elevenlabs.js

const coachVoices = {
  Rhonda: "x9leqCOAXOcmC5jtkq65",
  Jill: "2qfp6zPuviqeCOZIE9RZ",
  Scotty: "8kvxG72xUMYnIFhZYwWj",
  Terry: "UgBBYS2sOqTuMpoF3BR0",
  AJ: "ZT9u07TYPVl83ejeLakq",
  Chris: "gUABw7pXQjhjt0kNFBTF"
};

function cleanText(text) {
  return text
    .replace(/<[^>]*>?/gm, '') // Remove HTML tags
    .replace(/\*/g, '');       // Remove asterisks
}

const audioCache = new Map();

export async function speakResponse(text, coachName) {
  if (!coachName || !coachVoices[coachName]) {
    console.warn("No valid coach name passed to speakResponse. Skipping TTS.");
    return;
  }

  const voice = coachVoices[coachName];
  const plainText = cleanText(text);
  const cacheKey = `${coachName}:${plainText}`;

  if (audioCache.has(cacheKey)) {
    const cachedUrl = audioCache.get(cacheKey);
    const audio = new Audio(cachedUrl);
    audio.play();
    return;
  }

  try {
    const response = await fetch("https://api.elevenlabs.io/v1/text-to-speech/" + voice, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": process.env.REACT_APP_ELEVENLABS_TTS_KEY
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
    audioCache.set(cacheKey, audioUrl);

    const audio = new Audio(audioUrl);
    audio.play();

  } catch (err) {
    console.error("ElevenLabs TTS error:", err);
  }
}
