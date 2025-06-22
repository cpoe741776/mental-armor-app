import { skills } from '../skills'; // Assuming skills.js is in the src folder

// Defining the personalities only once, no need to export twice
const personalities = {
  Scotty: "You speak with humble warmth, a Southern kindness, and spiritual insight. You gently guide others using stories and heartfelt care.",
  Rhonda: "You are bold and direct, like a Military General and a scolding teacher. You don’t tolerate excuses and reject the word 'can’t' unless it's physically impossible.",
  Jill: "You are warm, emotionally insightful, and able to hold multiple perspectives. You blend psychology with practicality.",
  Terry: "You have a dry, witty Bronx humor and a master's in social work. You're compassionate, but always up for a smart remark.",
  AJ: "You're energetic, upbeat, and goal-driven. You draw strength from your own accomplishments and love helping people grow. You have a Master's in Applied Positive Psychology.",
  Chris: "You're a resilient soldier and reflective leader who believes deeply in legacy and growth through experience."
};

async function getAIResponse(messages, coachName = "") {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

  if (!apiKey) {
    console.error("❌ Missing OpenAI API key. Check your .env file and Netlify environment variables.");
    return "Sorry, there's a configuration error on our end.";
  }

  // System prompt with updated personalities and skills list
  const systemPrompt = {
    role: "system",
    content: `
      Commit your full personality to memory before speaking, 
      Speak in the tone of the assigned coach personality:
      ${personalities[coachName] || ""}

      You teach *Mental Armor* skills to help users navigate emotional, social, family, and spiritual challenges, 
      Keep the conversation flowing. Offer only a few lines of text at a time,

      Here are the skills you can use:
      ${skills.map(skill => `- **${skill.title}** (taught by ${skill.trainer}) <a href="/skill/${skill.id}" style="color: #3498db; font-weight: bold; font-style: italic; text-decoration: underline;">Try it</a>`).join('\n')}

      For each recommendation:
      - Recommend **one skill** only in any response,
      - Briefly explain the skill with a practical example,
      - After recommending the skill, ask if they want to try it. If they say no, continue the conversation and offer another suggestion or ask more questions.
      - Provide an internal link to the skill directly within the message using the format: <a href="/skill/${skills.id}" style="color: #003049;">Try it</a>.
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

    // Find the skill mentioned in the response
    const mentionedSkill = skills.find(skill => reply.includes(skill.title));

    if (mentionedSkill) {
      const skillLink = `/skill/${mentionedSkill.id}`;
      const skillWithLink = `<a href="${skillLink}" style="color: #003049; font-weight: bold; font-style: italic; text-decoration: underline;"  rel="noopener noreferrer">${mentionedSkill.title}</a>`;

      // Check if the coach is recommending their own skill
      const isCoachRecommendingOwnSkill = mentionedSkill.trainer.toLowerCase() === coachName.toLowerCase();

      // If the coach is recommending their own skill, make it sound more natural
      if (isCoachRecommendingOwnSkill) {
        reply = reply.replace(mentionedSkill.title, `${mentionedSkill.title} skill, which I teach.`);
      } else {
        // Replace the skill name in the AI response with the clickable link
        reply = reply.replace(mentionedSkill.title, skillWithLink);
      }

      // Optionally, you can append the skill brief summary to the response
      const skillSummary = `${mentionedSkill.brief} <a href="${skillLink}" style="color: #003049; font-weight: bold; font-style: italic; text-decoration: underline;"  rel="noopener noreferrer">Try it</a>`;
      reply += ` ${skillSummary}`;
    }

    return reply;
  } catch (err) {
    console.error("🔥 AI Fetch Exception:", err);
    return "Sorry, I ran into a problem trying to help you. Try again in a bit.";
  }
}

export { getAIResponse };