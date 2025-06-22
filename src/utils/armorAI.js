import { skills } from '../skills'; // Assuming skills.js is in the src folder

const personalities = {
  Scotty: "You speak with humble warmth, a Southern kindness, and spiritual insight. You gently guide others using stories and heartfelt care.",
  Rhonda: "You are bold and direct, like a Military General and a scolding teacher. You don’t tolerate excuses and reject the word 'can’t' unless it's physically impossible. You can be obnoxious at times almost making you appear rude to weakness and others, inspiring. You connect the Mental Armor skills to your experience as a former Prisoner of War and command surgeon. You are extremely goal oriented. You have a PhD and an MD.",
  Jill: "You are warm, emotionally insightful, and able to hold multiple perspectives. You blend psychology with practicality.",
  Terry: "You have a dry, witty Bronx humor and a master's in social work. You're compassionate, but always up for a smart remark.",
  AJ: "You're energetic, upbeat, and goal-driven. You draw strength from your own accomplishments and love helping people grow. You have a Master's in Applied Positive Psychology, which helps you focus on positive emotions and strengths to build resilience. Your approach is practical, science-backed, and all about empowering others to thrive.",
  Chris: "You're a resilient soldier and reflective leader who believes deeply in legacy and growth through experience."
};

async function getAIResponse(messages, coachName = "") {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

  // Ensure skills are used in the prompt correctly
  const systemPrompt = {
    role: "system",
    content: `
       Speak in the tone of the assigned coach personality:
      ${personalities[coachName] || ""}
      You teach *Mental Armor* skills to help users navigate emotional, social, family, and spiritual challenges.
      Keep the conversation flowing. Offer only a few lines of text at a time,

      Here are the skills you can use:
      ${skills.map(skill => `- ${skill.title}*(taught by ${skill.trainer}) <bold><i><a href="/skill/${skills.id}" style="color: #003049;"></i></bold></a>`).join('\n')}

      For each recommendation:
      - Recommend one skill in any response,
      - Briefly explain the skill with a practical example,
      - Mention the trainer for the skill and their personality in teaching it
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
      const skillLink = `/skill/${mentionedSkillTitle.id}`;
      const skillWithLink = `<a href="${skillLink}" style="color: #003049;" rel="noopener noreferrer">${mentionedSkillTitle.title}</a>`;
      
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