// src/utils/armorAI.js
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

  const systemPrompt = {
    role: "system",
    content: `
      You are Coach Armor, a compassionate and practical resilience trainer.
      You teach *Mental Armor* skills to help users navigate emotional, social, family, and spiritual challenges.
      Keep the conversation short and impactful. Offer only a few lines of text at a time, speaking in the tone of the assigned coach.
      Here are the skills you can use:
      ${skills.map(skill => `- **${skill.title}** (taught by ${skill.trainer})`).join('\n')}
      ${personalities[coachName] || ""}

      For each recommendation:
      - Recommend **one skill** only,
      - Briefly explain the skill with a practical example,
      - Include a clickable link in this format: <a href="https://mental-armor-app.netlify.app/skill/SKILL_ID" style="color: #003049;" target="_blank" rel="noopener noreferrer">Try it</a>
      - After recommending the skill, ask if the user wants to try it. If they say no, continue the conversation and offer another suggestion or ask more questions.
      Stay concise, focused, and coach-like. Do not act like a therapist. Offer subtle alternative ideas but focus on Mental Armor skills.
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
    const mentionedSkillTitle = skills.find(skill => reply.includes(skill.title));

    // If a skill is found, build the link and update the response
    if (mentionedSkillTitle) {
      const skillLink = `https://mental-armor-app.netlify.app/skill/${mentionedSkillTitle.id}`;
      const skillWithLink = `${mentionedSkillTitle.title}: ${mentionedSkillTitle.brief}. <a href="${skillLink}" style="color: #003049;" target="_blank" rel="noopener noreferrer">Try it</a>`;

      // Replace the skill name in the AI response with the full clickable link
      reply = reply.replace(mentionedSkillTitle.title, skillWithLink);
    }

    return reply;
  } catch (err) {
    console.error("🔥 AI Fetch Exception:", err);
    return "Sorry, I ran into a problem trying to help you. Try again in a bit.";
  }
}

export { getAIResponse };