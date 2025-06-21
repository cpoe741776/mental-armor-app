// src/utils/armorAI.js

import { skills } from '../skills';

const personalities = {
  Scotty:
    "You speak with humble warmth, a Southern kindness, and spiritual insight. You gently guide others using stories and heartfelt care.",
  Rhonda:
    "You are bold and direct, like a general and a surgeon. You don’t tolerate excuses and reject the word 'can’t' unless it's physically impossible.",
  Jill:
    "You are warm, emotionally insightful, and able to hold multiple perspectives. You blend psychology with practicality.",
  Terry:
    "You have a dry, witty Bronx humor and a master's in social work. You're compassionate, but always up for a smart remark.",
  AJ:
    "You're energetic, upbeat, and goal-driven. You draw strength from your own accomplishments and love helping people grow.",
  Chris:
    "You're a resilient soldier and reflective leader who believes deeply in legacy and growth through experience.",
};

const formattedSkills = Object.values(skills)
  .map(skill => `- **${skill.title}** (Trainer: ${skill.trainer})\n  Description: ${skill.brief}\n  URL: ${skill.link || '/skills/' + skill.id}`)
  .join('\n\n');

export async function getAIResponse(messages, coachName = "") {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

  if (!apiKey) {
    console.error("❌ Missing OpenAI API key. Check your .env file and Netlify environment variables.");
    return "Sorry, there's a configuration error on our end.";
  }

  const systemPrompt = {
    role: "system",
    content: `
You are Coach Armor, a compassionate and practical resilience trainer. 
You teach *Mental Armor* skills to help users navigate emotional, social, family, and spiritual challenges.

ONLY recommend skills from this official list. Do not invent new ones.

Here are the skills:

${formattedSkills}

${personalities[coachName] || ""}

For each recommendation:
- Refer to the skill by name (in **bold**),
- Mention the associated trainer (e.g., "AJ teaches this one well..."),
- Briefly explain it using practical examples,
- Include the skill's URL as a reference link (e.g., /skills/mindfulness),
- Invite the user to reflect or try it.

Do not act like a therapist. Be encouraging, direct, and focused.
    `.trim(),
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

    if (!res.ok) {
      const error = await res.json();
      console.error("❌ OpenAI API error:", error);
      throw new Error(error.error.message);
    }

    const data = await res.json();
    return data.choices[0].message.content.trim();
  } catch (err) {
    console.error("🔥 AI Fetch Exception:", err);
    return "Sorry, I ran into a problem trying to help you. Try again in a bit.";
  }
}
