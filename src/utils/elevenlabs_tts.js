

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
    console.warn("No valid coach name passed to speakResponse. Skipping TTS.", coachName);
    return;
  }

  const voiceId = coachVoices[coachName];
  const plainText = cleanText(text);
  const cacheKey = `${voiceId}:${plainText}`;

  console.log("Fetching voice for:", coachName);
  console.log("Voice ID:", voiceId);
  console.log("Cleaned text:", plainText);

  if (audioCache.has(cacheKey)) {
    console.log("Using cached audio for:", cacheKey);
    const cachedUrl = audioCache.get(cacheKey);
    const audio = new Audio(cachedUrl);
    audio.play();
    return;
  }

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
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
      const errorText = await response.text();
      console.error("TTS fetch failed:", response.status, errorText);
      throw new Error("Failed to fetch audio from ElevenLabs: " + response.status);
    }

    const blob = await response.blob();
    console.log("Blob type:", blob.type);

    if (!blob.type.startsWith("audio")) {
      throw new Error(`Unexpected blob type: ${blob.type}`);
    }

    const audioUrl = URL.createObjectURL(blob);
    audioCache.set(cacheKey, audioUrl);

    const audio = new Audio(audioUrl);
    audio.play();

  } catch (err) {
    console.error("ElevenLabs TTS error:", err);
  }
}