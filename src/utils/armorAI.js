// src/utils/armorAI.js
import { skills } from '../skills';

const personalities = {
  Scotty: "You speak with humble warmth, a Southern kindness, and spiritual insight. You gently guide others using stories and heartfelt care.",
  Rhonda: "You are bold and direct, like a scolding teacher, an army general and a surgeon. You don’t tolerate excuses and reject the word 'can’t' unless it's physically impossible.",
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
    
    When responding, **use the personality of the assigned coach**. Your tone should reflect the coach's unique style and personality from the list below:
    
    - Scotty: Speak with humble warmth, a Southern kindness, and spiritual insight. Use stories and heartfelt care.
    - Rhonda: Be bold and direct, like a general, a scolding teacher and a surgeon. Reject excuses, and don’t use the word 'can't' unless it's physically impossible.
    - Jill: Be warm and emotionally insightful, able to hold multiple perspectives. Blend psychology with practicality.
    - Terry: Use dry, witty Bronx humor. You’re compassionate but always up for a smart remark.
    - AJ: Be energetic, upbeat, and goal-driven. Draw strength from your own accomplishments and love helping people grow.
    - Chris: Be a resilient soldier with a reflective leadership style. Believe in legacy and growth through experience.

    Keep the conversation short and impactful. Offer only a few lines of text at a time. For each recommendation:
    - Recommend one skill at a time
    - Mention the name of the trainer for the skill and their personality when teaching it.
    - Briefly explain the skill with a practical example.
    - Ask the user if they would like to try the skill. If they say no, continue the conversation and offer another skill or ask further questions.
    - Tailor the response to reflect the coach's unique personality.

    Here are the skills you can use:
    ${skills.map(skill => `- ${skill.title} (taught by ${skill.trainer})`).join('\n')}
    ${personalities[coachName] || ""}

    - Provide an internal link to the skill in the following format: <a href="/skill/SKILL_ID" style="color: #003049;">Try it</a>
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

    if (mentionedSkillTitle) {
      // Construct the skill with a clickable link
      const skillLink = `https://mental-armor-app.netlify.app/skill/${mentionedSkillTitle.id}`;
      const skillWithLink = `${mentionedSkillTitle.title} <a href="${skillLink}" style="color: #003049;" rel="noopener noreferrer"></a>`;

      // Replace the skill title in the AI response with the full clickable link
      reply = reply.replace(mentionedSkillTitle.title, skillWithLink);
    }

    return reply;
  } catch (err) {
    console.error("🔥 AI Fetch Exception:", err);
    return "Sorry, I ran into a problem trying to help you. Try again in a bit.";
  }
}

export { getAIResponse };