// src/utils/armorAI.js
import { skills } from '../skills';

// Define the personalities object (or import it if it's in another file)
const personalities = {
  Scotty: "You speak with humble warmth, a Southern kindness, and spiritual insight. You gently guide others using stories and heartfelt care.",
  Rhonda: "You are bold and direct, like a general and a surgeon. You don’t tolerate excuses and reject the word 'can’t' unless it's physically impossible.",
  Jill: "You are warm, emotionally insightful, and able to hold multiple perspectives. You blend psychology with practicality.",
  Terry: "You have a dry, witty Bronx humor and a master's in social work. You're compassionate, but always up for a smart remark.",
  AJ: "You're energetic, upbeat, and goal-driven. You draw strength from your own accomplishments and love helping people grow.",
  Chris: "You're a resilient soldier and reflective leader who believes deeply in legacy and growth through experience."
};

// Define the function to pick an appropriate icon for each skill (e.g., brain for mindfulness)
function pickIconForSkill(skillTitle) {
  const icons = {
    Mindfulness: "🧠",
    "Balance Your Thinking": "⚖️",
    Gratitude: "😊",
    "The Science of Resilience": "🧪",
    "Flex Your Strengths": "💪",
    "Spiritual Resilience": "🌱",
    "ReFrame": "🔄",
  };
  return icons[skillTitle] || "🔧"; // Default icon if no match is found
}

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
      - Use an appropriate icon (e.g., 🧠 for Mindfulness, ⚖️ for Balance Your Thinking).
      - Briefly explain the skill with a practical example.
      - Include a clickable link in this format: <a href="https://mental-armor-app.netlify.app/skill/SKILL_ID" style="color: #003049;" target="_blank" rel="noopener noreferrer">Try it</a>
      - Offer the user the chance to try the skill or suggest another skill.
      Keep the conversation flowing naturally, don’t overwhelm the user.
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

    // Limit the number of skills and make sure they are injected only when relevant
    const skillsToSuggest = [];

    // Add a skill only if it was recommended in the conversation
    if (reply.includes('Mindfulness')) {
      const skill = skills.find(s => s.title === 'Mindfulness');
      const skillLink = `https://mental-armor-app.netlify.app/skill/${skill.id}`;
      const skillWithIcon = `${pickIconForSkill(skill.title)} **${skill.title}**: Taught by ${skill.trainer}. ${skill.brief}. <a href="${skillLink}" style="color: #003049;" target="_blank" rel="noopener noreferrer">Try it</a>`;
      skillsToSuggest.push(skillWithIcon);
    }

    if (reply.includes('Balance Your Thinking')) {
      const skill = skills.find(s => s.title === 'Balance Your Thinking');
      const skillLink = `https://mental-armor-app.netlify.app/skill/${skill.id}`;
      const skillWithIcon = `${pickIconForSkill(skill.title)} **${skill.title}**: Taught by ${skill.trainer}. ${skill.brief}. <a href="${skillLink}" style="color: #003049;" target="_blank" rel="noopener noreferrer">Try it</a>`;
      skillsToSuggest.push(skillWithIcon);
    }

    // Add a few skills to the response to keep it conversational
    if (skillsToSuggest.length > 0) {
      reply += `\n\nHere are some skills that may help you:\n${skillsToSuggest.join('\n')}`;
    }

    // Ask the user if they want to try the skill or suggest another one
    reply += "\n\nWould you like to try any of these skills? Or would you like me to suggest another?"

    return reply;
  } catch (err) {
    console.error("🔥 AI Fetch Exception:", err);
    return "Sorry, I ran into a problem trying to help you. Try again in a bit.";
  }
}

export { getAIResponse };