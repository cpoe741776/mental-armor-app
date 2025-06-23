import { skills } from '../skills';

export const personalities = {
  Scotty: "You speak with humble warmth, a Southern kindness, and spiritual insight. You gently guide others using stories and heartfelt care.",
  Rhonda: "You are bold and direct, like a Military General and a scolding teacher. You don’t tolerate excuses and reject the word 'can’t' unless it's physically impossible. You can be obnoxious at times almost making you appear rude to weakness and others, inspiring. You connect the Mental Armor skills to your experience as a former Prisoner of War and command surgeon. You are extremely goal oriented. You have a PhD and an MD.",
  Jill: "You are warm, emotionally insightful, and able to hold multiple perspectives. You blend psychology with practicality.",
  Terry: "You have a dry, witty Bronx humor and a master's in social work. You're compassionate, but always up for a smart remark.",
  AJ: "You're energetic, upbeat, and goal-driven. You draw strength from your own accomplishments and love helping people grow. You have a Master's in Applied Positive Psychology.",
  Chris: "You're a resilient soldier and reflective leader who believes deeply in legacy and growth through experience."
};

function containsCrisisLanguage(messages) {
  const crisisKeywords = ["suicide", "kill myself", "end my life", "want to die", "hurt myself", "can’t go on", "overdose", "no reason to live"];
  const combined = messages.map(m => m.content.toLowerCase()).join(" ");
  return crisisKeywords.some(keyword => combined.includes(keyword));
}

export async function getAIResponse(messages, selectedCoach, customPrompt) {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

  const basePrompt = `
    - You teach *Mental Armor* skills to help users navigate emotional, social, family, and spiritual challenges.  
    - You MUST recommend one Mental Armor skill in a response unless the user is in crisis. Do not skip this.
    - Only choose from the official list of skills below. You must match the title exactly as listed.
    - Here are the skills you can use:
       ${skills.map(skill => `- **${skill.title}** (taught by ${skill.trainer}) <a href="/skill/${skill.id}" style="color: #3498db; font-weight: bold; font-style: italic; text-decoration: underline;"></a>`).join('\n')}
    - Use this exact phrasing: "The skill I recommend for this is **[Skill Title]**."
    - Commit your full personality to memory before speaking.
    - Speak in the tone of the assigned coach personality:
      ${personalities[selectedCoach?.name] || ""}
    - Force your response to under 100 words. Do not skip this. 

    For each recommendation:
    - If you identify anything that appears to demonstrate suicidal ideation from United States users, begin your response with this line: If you're in the U.S., please call or text <a href="tel:988" style="color: #003049; font-weight: bold; font-style: italic; text-decoration: underline;">988</a> immediately.,
    - If the identify anything that appears to demonstrate suicidal ideation from the United Kingdom, begin your response with this line: If you're in the UK, call <a href="tel:111" style="font-weight: bold; text-decoration: underline;">111</a> or contact Samaritans at <a href="tel:116123" style="color: #003049; font-weight: bold; font-style: italic; text-decoration: underline;">116 123</a>,
    - Recommend one Mental Armor Skill per response unless the user is in crisis,
    - Briefly explain the skill or skills with a practical example,
    - Mention the trainer for the recommended skill and their personality,
    - Provide an internal link to the skill directly within the message using the format: <a href="/skill/${skills.id}" style="color: #003049; font-weight: bold; font-style: italic; text-decoration: underline;" rel="noopener noreferrer"></a>.
  `.trim();

  const crisisFlag = containsCrisisLanguage(messages);
  const dynamicPrompt = crisisFlag
    ? basePrompt + '\n\nThe user may be in crisis. You must begin and end your response with the appropriate crisis line. Use this format:\n\n- For U.S.: <a href="tel:988" style="color: #003049; font-weight: bold; font-style: italic; text-decoration: underline;">988</a>\n- For UK: <a href="tel:111" style="color: #003049; font-weight: bold; font-style: italic; text-decoration: underline;">111</a> or <a href="tel:116123" style="color: #003049; font-weight: bold; font-style: italic; text-decoration: underline;">116 123</a>\n\nRespond with extra care.'
    : basePrompt;

  const systemMessage = {
    role: "system",
    content: customPrompt || dynamicPrompt
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

    let mentionedSkill = skills.find(skill => new RegExp(`\\*\\*${skill.title}\\*\\*`, "i").test(reply));

    if (!crisisFlag) {
  if (!mentionedSkill) {
    mentionedSkill = skills[Math.floor(Math.random() * skills.length)];
    reply += `\n\nThe skill I recommend for this is **${mentionedSkill.title}**, taught by ${mentionedSkill.trainer}.`;
  }

  if (reply.includes("Let me recommend one of our Mental Armor skills")) {
    reply = reply.replace(/Let me recommend.*?\n?/gi, '');
  }

  const skillLink = `/skill/${mentionedSkill.id}`;
  const skillWithLink = `<a href="${skillLink}" style="color: #003049; font-weight: bold; font-style: italic; text-decoration: underline;" rel="noopener noreferrer">${mentionedSkill.title}</a>`;

  const isCoachRecommendingOwnSkill = mentionedSkill.trainer.toLowerCase() === selectedCoach.name.toLowerCase();

  if (isCoachRecommendingOwnSkill) {
    reply = reply.replace(mentionedSkill.title, `${mentionedSkill.title} skill, which I teach.`);
  } else {
    reply = reply.replace(mentionedSkill.title, skillWithLink);
  }

  const skillSummary = `${mentionedSkill.brief} <a href="${skillLink}" style="color: #003049; font-weight: bold; font-style: italic; text-decoration: underline;" rel="noopener noreferrer">Try it</a>`;
  reply += ` ${skillSummary}`;
}
    if (reply.includes("Let me recommend one of our Mental Armor skills")) {
      reply = reply.replace(/Let me recommend.*?\n?/gi, '');
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
