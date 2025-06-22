import { skills } from './skills'; // Assuming skills.js is in the src folder
import { personalities } from './utils/armorAI';

async function getAIResponse(messages, selectedCoach) {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

  // Ensure skills are used in the prompt correctly
  const systemPrompt = {
    role: "system",
    content: `
      Commit your full personality to memory before speaking, 
      Speak in the tone of the assigned coach personality:
      ${personalities[selectedCoach?.name] || ""}  // Use selectedCoach.name here
      You teach *Mental Armor* skills to help users navigate emotional, social, family, and spiritual challenges, 
      Keep the conversation flowing. Offer only a few lines of text at a time,
      
      Here are the skills you can use:
      ${skills.map(skill => `- **${skill.title}** (taught by ${skill.trainer}) <a href="/skill/${skill.id}" style="color: #3498db; font-weight: bold; font-style: italic; text-decoration: underline;">Try it</a>`).join('\n')}
      
      For each recommendation:
      - Recommend **one skill** only in any response,
      - Briefly explain the skill with a practical example,
      - Mention the trainer who teaches the skill and their personality with the skill
      - Provide an internal link to the skill directly within the message using the format: <a href="/skill/${skills.id}" style="color: #003049; font-weight: bold; font-style: italic; text-decoration: underline;"></a>.
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
      const skillWithLink = `<a href="${skillLink}" style="color: #003049; font-weight: bold; font-style: italic; text-decoration: underline;" rel="noopener noreferrer">${mentionedSkill.title}</a>`;

      // Check if the coach is recommending their own skill based on the "trainer" field
      const isCoachRecommendingOwnSkill = mentionedSkill.trainer.toLowerCase() === selectedCoach.name.toLowerCase();

      // If the coach is recommending their own skill, make it sound more natural
      if (isCoachRecommendingOwnSkill) {
        // Replace the skill title with a more natural phrasing when the coach recommends their own skill
        reply = reply.replace(mentionedSkill.title, `${mentionedSkill.title} skill, which I teach.`);
      } else {
        // Replace the skill name in the AI response with the clickable link
        reply = reply.replace(mentionedSkill.title, skillWithLink);
      }

      // Optionally, you can append the skill brief summary to the response
      const skillSummary = `${mentionedSkill.brief} <a href="${skillLink}" style="color: #003049; font-weight: bold; font-style: italic; text-decoration: underline;" rel="noopener noreferrer">Try it</a>`;
      reply += ` ${skillSummary}`;
    }

    return reply;
  } catch (err) {
    console.error("🔥 AI Fetch Exception:", err);
    return "Sorry, I ran into a problem trying to help you. Try again in a bit.";
  }
}

export { getAIResponse };