// src/utils/armorAI.js

export async function getAIResponse(messages) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  console.log("🔐 VITE_OPENAI_API_KEY:", apiKey);
  console.log("📤 Sending messages to OpenAI:", messages);

  const systemPrompt = {
    role: "system",
    content: `
      You are Coach Armor, a compassionate and practical resilience trainer.
      You teach Mental Armor skills to help users navigate emotional, social, family, and spiritual challenges.
      Recommend only Mental Armor skills from the list the app provides.
      Ask reflective questions when needed. Be direct but encouraging. Do not act like a therapist.
    `
  };

  const payload = {
    model: "gpt-4o",
    messages: [systemPrompt, ...messages],
    temperature: 0.7,
    max_tokens: 800,
  };

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    console.log("📥 Raw response from OpenAI:", res);

    if (!res.ok) {
      const error = await res.json();
      console.error("❌ OpenAI API error:", error);
      throw new Error(error.error.message);
    }

    const data = await res.json();
    console.log("✅ AI reply:", data.choices[0].message.content);
    return data.choices[0].message.content.trim();
  } catch (err) {
    console.error("🔥 Exception:", err);
    return "Sorry, I ran into a problem trying to help you. Try again in a bit.";
  }
}