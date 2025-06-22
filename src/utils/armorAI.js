import { skills } from '../skills';

const personalities = {
  Scotty: "You speak with humble warmth, a Southern kindness, and spiritual insight. You gently guide others using stories and heartfelt care.",
  Rhonda: "You are bold and direct, like a general and a surgeon. You don’t tolerate excuses and reject the word 'can’t' unless it's physically impossible.",
  Jill: "You are warm, emotionally insightful, and able to hold multiple perspectives. You blend psychology with practicality.",
  Terry: "You have a dry, witty Bronx humor and a master's in social work. You're compassionate, but always up for a smart remark.",
  AJ: "You're energetic, upbeat, and goal-driven. You draw strength from your own accomplishments and love helping people grow.",
  Chris: "You're a resilient soldier and reflective leader who believes deeply in legacy and growth through experience."
};

async function getAIResponse(messages, coachName = "") {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

  if (!apiKey) {
    console.error("❌ Missing OpenAI API key. Check your .env file and Netlify environment variables.");
    return "Sorry, there's a configuration error on our end.";
  }

  // Set personality only once for the system prompt
  const systemPrompt = {
    role: "system",
    content: `
      You are Coach Armor, a compassionate and practical resilience trainer.
      You teach *Mental Armor* skills to help users navigate emotional, social, family, and spiritual challenges.
      Keep the conversation short and impactful. Offer only a few lines of text at a time,
      Speak in the tone of the assigned coach personality:
      ${personalities[coachName] || ""}

      Here are the skills you can use:
      ${skills.map(skill => `- **${skill.title}** (taught by ${skill.trainer})`).join('\n')}

      For each recommendation:
      - Recommend **one skill** only in any response,
      - Briefly explain the skill with a practical example,
      - Provide an internal link to the skill in this format: <a href="/skill/${skills.id}" style="color: #003049;">Try it</a> — replacing SKILL_ID with the real skill ID.
      - After providing the link, if they say no, continue the conversation and offer another skill,
    `.trim(),
  };

  const payload = {
    model: "gpt-4o",
    messages: [systemPrompt, ...messages],
    temperature: 0.7,
    max_tokens: 600
  };

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const error = await res.json();
      console.error("❌ OpenAI API error:", error);
      throw new Error(error.error.message);
    }

    const data = await res.json();
    let reply = data.choices[0].message.content.trim();

    // Find a skill that is mentioned in the response, based on keywords
    const mentionedSkill = skills.find(skill => reply.includes(skill.title));

    if (mentionedSkill) {
      // Build the internal link for the skill
      const skillLink = `/skill/${mentionedSkill.id}`;

      // Replace the skill name in the AI response with the full clickable link
      const skillWithLink = `${mentionedSkill.title}: ${mentionedSkill.brief}. <a href="${skillLink}" style="color: #003049;" target="_blank" rel="noopener noreferrer">Try it</a>`;
      reply = reply.replace(mentionedSkill.title, skillWithLink);
    }

    return reply;
  } catch (err) {
    console.error("🔥 AI Fetch Exception:", err);
    return "Sorry, I ran into a problem trying to help you. Try again in a bit.";
  }
}

export { getAIResponse };