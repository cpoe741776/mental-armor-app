// src/utils/armorAI.js

import { skills } from '../skills';

// Define the personalities for each coach
const personalities = {
  Scotty: "You speak with humble warmth, a Southern kindness, and spiritual insight. You gently guide others using stories and heartfelt care.",
  Rhonda: "You are bold and direct, like a general and a surgeon. You don’t tolerate excuses and reject the word 'can’t' unless it's physically impossible.",
  Jill: "You are warm, emotionally insightful, and able to hold multiple perspectives. You blend psychology with practicality.",
  Terry: "You have a dry, witty Bronx humor and a master's in social work. You're compassionate, but always up for a smart remark.",
  AJ: "You're energetic, upbeat, and goal-driven. You draw strength from your own accomplishments and love helping people grow.",
  Chris: "You're a resilient soldier and reflective leader who believes deeply in legacy and growth through experience."
};

// Function to pick a random icon for each skill
const pickIconForSkill = (skillTitle) => {
  const iconMap = {
    'Balance Your Thinking': '⚖️',
    'Mindfulness': '🧠',
    'Gratitude': '😊', // Smiley emoji for Gratitude
    'ReFrame': '🔄',
    'Spiritual Resilience': '🌱', // New non-religious icon for Spiritual Resilience (representing growth)
    'Flex Your Strengths': '💪',
    'The Science of Resilience': '🧪', // Beakers for Science of Resilience
    'Interpersonal Problem Solving': '🤝'
  };

  return iconMap[skillTitle] || '✨'; // Default icon if no match
};

// Define the function to get AI response
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
      Keep the conversation short and impactful. Offer a few lines at a time, and speak in the tone of the assigned coach.

      Coach personalities:
      ${personalities[coachName] || ""}

      Use these skills only:
      ${skills.map(skill => `- **${skill.title}** (taught by ${skill.trainer})`).join('\n')}
      
      For each skill recommendation:
      - Use an appropriate icon for each skill (e.g., ⚖️ for Balance Your Thinking, 🧠 for Mindfulness).
      - Briefly explain the skill with a practical example.
      - Include a clickable link in this format: <a href="https://mental-armor-app.netlify.app/skill/SKILL_ID" style="color: #003049;" target="_blank" rel="noopener noreferrer">Give it a go!</a>
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

    // Loop through skills and inject them into the response with icons and links
    skills.forEach((skill) => {
      const skillLink = `https://mental-armor-app.netlify.app/skill/${skill.id}`;
      const skillWithIcon = `${pickIconForSkill(skill.title)} **${skill.title}**: Taught by ${skill.trainer}. ${skill.brief}. <a href="${skillLink}" style="color: #003049;" target="_blank" rel="noopener noreferrer">Learn more</a>`;
      reply = reply.replace(new RegExp(`\\b${skill.title}\\b`, 'g'), skillWithIcon);
    });

    // Ask the user if they want to try the skill or suggest another one
    reply += "\n\nWould you like to try this skill? If not, I can suggest another one."

    return reply;
  } catch (err) {
    console.error("🔥 AI Fetch Exception:", err);
    return "Sorry, I ran into a problem trying to help you. Try again in a bit.";
  }
}

export { getAIResponse };