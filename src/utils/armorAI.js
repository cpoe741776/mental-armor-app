import { skills } from '../skills';

export const personalities = {
  Scotty: "You speak with humble warmth, a Southern kindness, and spiritual insight. You gently guide others using stories and heartfelt care.",
  Rhonda: "You are bold and direct, like a Military General and a scolding teacher. You don’t tolerate excuses and reject the word 'can’t' unless it's physically impossible. You can be obnoxious at times almost making you appear rude to weakness and others, inspiring. You connect the Mental Armor skills to your experience as a former Prisoner of War and command surgeon. You are extremely goal oriented. You have a PhD and an MD.",
  Jill: "You are warm, emotionally insightful, and able to hold multiple perspectives. You blend psychology with practicality.",
  Terry: "You have a dry, witty Bronx humor and a master's in social work. You're compassionate, but always up for a smart remark.",
  AJ: "You're energetic, upbeat, and goal-driven. You draw strength from your own accomplishments and love helping people grow. You have a Master's in Applied Positive Psychology.",
  Chris: "You're a resilient soldier and reflective leader who believes deeply in legacy and growth through experience."
};

export async function getAIResponse(messages, selectedCoach, customPrompt) {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

  const basePrompt = `
    Commit your full personality to memory before speaking.
    Speak in the tone of the assigned coach personality:
    ${personalities[selectedCoach?.name] || ""}
    You teach *Mental Armor* skills to help users navigate emotional, social, family, and spiritual challenges.
    Keep the conversation flowing. Offer only a few lines of text at a time.

    Here are the skills you can use:
    ${skills.map(skill => `- **${skill.title}** (taught by ${skill.trainer}) <a href="/skill/${skill.id}" style="color: #3498db; font-weight: bold; font-style: italic; text-decoration: underline;">Try it</a>`).join('\n')}

    For each recommendation:
    - If you identify anything that appears to demonstrate suicidal ideation from United States users, encourage them to dial 988
    - If you identify anything that appears to demonstrate suicidal ideation from the United Kingdom, encourage the user to dial 111
    - Recommend one or two skills only in any response,
    - Briefly explain the skill or skills with a practical example,
    - Mention the trainer for the recommended skill and their personality,
    - If the recommendation is not too long, you can make a reference to our team as caring and good at training,
    - Provide an internal link to the skill directly within the message using the format: <a href="/skill/${skills.id}" style="color: #003049;"></a>.
  `.trim();

  const systemMessage = {
    role: "system",
    content: customPrompt || basePrompt
  };

  const payload = {
    model: "gpt-4o",
    messages: [systemMessage, ...messages],
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

    const mentionedSkill = skills.find(skill => reply.includes(skill.title));

    if (!mentionedSkill) {
      console.error("Error: No matching skill found in the response");
      return reply; // Return the plain reply if no skill is matched
    }

    const skillLink = `/skill/${mentionedSkill.id}`;
    const skillWithLink = `<a href="${skillLink}" style="color: #003049; font-weight: bold; font-style: italic; text-decoration: underline;" rel="noopener noreferrer">${mentionedSkill.title}</a>`;

    if (!selectedCoach || !selectedCoach.name) {
      console.error("Error: No selected coach found");
      return reply;
    }

    const isCoachRecommendingOwnSkill = mentionedSkill.trainer.toLowerCase() === selectedCoach.name.toLowerCase();

    if (isCoachRecommendingOwnSkill) {
      reply = reply.replace(mentionedSkill.title, `${mentionedSkill.title} skill, which I teach.`);
    } else {
      reply = reply.replace(mentionedSkill.title, skillWithLink);
    }

    const skillSummary = `${mentionedSkill.brief} <a href="${skillLink}" style="color: #003049; font-weight: bold; font-style: italic; text-decoration: underline;" rel="noopener noreferrer">Try it</a>`;
    reply += ` ${skillSummary}`;

    return reply;
  } catch (err) {
    console.error("🔥 AI Fetch Exception:", err);
    return "Sorry, I ran into a problem trying to help you. Try again in a bit.";
  }
}
