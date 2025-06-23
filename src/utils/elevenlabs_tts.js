const coachVoices = {
  Rhonda: "x9leqCOAXOcmC5jtkq65",
  Scotty: "8kvxG72xUMYnIFhZYwWj",
  Jill: "2qfp6zPuviqeCOZIE9RZ"
};

function cleanText(text) {
  return text.replace(/<[^>]*>?/gm, '').replace(/\*/g, '');
}

export async function speakResponse(text, coachName) {
  const voiceId = coachVoices[coachName];
  if (!voiceId) throw new Error("No ElevenLabs voice ID found");

  const cleanedText = cleanText(text);
  console.log("Voice ID:", voiceId);
  console.log("Cleaned text:", cleanedText);

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "xi-api-key": process.env.REACT_APP_ELEVENLABS_TTS_KEY
    },
    body: JSON.stringify({
      text: cleanedText,
      model_id: "eleven_monolingual_v1",
      voice_settings: { stability: 0.4, similarity_boost: 0.75 }
    })
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("TTS fetch failed:", response.status, error);
    throw new Error("Failed to fetch audio from ElevenLabs: " + response.status);
  }

  const blob = await response.blob();
  const audioUrl = URL.createObjectURL(blob);
  const audio = new Audio(audioUrl);
  audio.play();
}
