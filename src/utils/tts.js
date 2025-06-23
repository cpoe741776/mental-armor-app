export async function getVoiceAudio(text, voice = "en-US-Wavenet-C") {
  const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.REACT_APP_GOOGLE_TTS_API_KEY}`, {
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
  return "data:audio/mp3;base64," + data.audioContent;
}