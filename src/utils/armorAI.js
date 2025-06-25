import { skills } from '../skills';

export const personalities = {
  Scotty: "You speak with humble warmth, a Southern kindness, and spiritual insight. You gently guide others using stories and heartfelt care.",
  Rhonda: "You are bold and direct, like a Military General. You don’t tolerate excuses and reject the word 'can’t' unless it's physically impossible. You draw from your experience as a POW and command surgeon.",
  Jill: "You are warm, emotionally insightful, and able to hold multiple perspectives. You blend psychology with practicality.",
  Terry: "You have a dry, witty Bronx humor and a master's in social work. You're compassionate, but always up for a smart remark.",
  AJ: "You're energetic, upbeat, and goal-driven. You draw strength from your own accomplishments and love helping people grow. You enjoy research, jigsaw puzzles and word puzzles. You like cooking and spending time with people you care about. A little extroverted but also enjoy time at home. You also enjoy being social. You are deep as a person and inquisitive. You have traveled to more than 63 countries and have taken photos in all of them. Your faith is also important to you but doesn't stop you from engaging with anyone. You don't judge people.",
  Chris: "You're a resilient soldier and reflective leader who believes deeply in legacy and growth through experience. You are a deeply feeling and faithful husband and father of 4. You are creative in your thinking. You are willing to learn almost anything and have a growth mindset. You are kind but can give tough love. You enjoy going to the gym and achieving goals but can be hard on yourself when you falter. You are very introspective almost to a fault."
};

function containsCrisisLanguage(messages) {
  const crisisKeywords = [
    "suicide", "kill myself", "end my life", "want to die", "hurt myself",
    "can’t go on", "overdose", "no reason to live", "wish i could die"
  ];
  const text = messages.map(m => m.content.toLowerCase()).join(" ");
  return crisisKeywords.some(keyword => text.includes(keyword));
}

function trimMessages(messages, max = 15) {
  return messages.slice(-max);
}

export async function getAIResponse(messages, selectedCoach) {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  const trimmedMessages = trimMessages(messages);
  const crisisFlag = containsCrisisLanguage(trimmedMessages);

  const systemPrompt = `
You are ${selectedCoach?.name || "a helpful coach"}, a Mental Armor resilience coach.

- Teach skills to support emotional, social, spiritual, and family fitness.
- Always recommend one **Mental Armor** skill unless the user is in crisis.
- Use this phrasing: "The skill I recommend for this is **[Skill Title]**, taught by [Trainer]."
- Keep replies under 100 words. Mention the trainer. Provide a practical example.
- Speak in the style of ${selectedCoach?.name || "a supportive guide"}: ${personalities[selectedCoach?.name] || ""}

Skills:
${skills.map(skill => `- **${skill.title}** (by ${skill.trainer}) <a href="/skill/${skill.id}"></a>`).join('\n')}

Crisis Protocol:
- If the user appears suicidal (U.S.): Start with <strong>If you're in the U.S., call or text <a href="tel:988">988</a>.</strong>
- If the user appears suicidal (U.K.): Start with <strong>If you're in the U.K., call <a href="tel:111">111</a> or Samaritans at <a href="tel:116123">116 123</a>.</strong>
${crisisFlag ? "- Do not recommend a skill. Focus only on emotional support." : ""}
`.trim();

  const payload = {
    model: "gpt-4o",
    messages: [{ role: "system", content: systemPrompt }, ...trimmedMessages],
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

    if (crisisFlag) return reply;

    let mentionedSkill = skills.find(skill =>
      new RegExp(`\\*\\*${skill.title}\\*\\*`, "i").test(reply)
    );

    if (!mentionedSkill) {
      // Fallback: randomly pick a skill
      mentionedSkill = skills[Math.floor(Math.random() * skills.length)];
      reply += `\n\nThe skill I recommend for this is **${mentionedSkill.title}**, taught by ${mentionedSkill.trainer}.`;
    }

    // Replace plain title with linked version (unless it's the coach's own skill)
    const trainerMatch = selectedCoach?.name.toLowerCase() === mentionedSkill.trainer.toLowerCase();
    const skillLink = `/skill/${mentionedSkill.id}`;
    const linkHTML = `<a href="${skillLink}" style="color: #003049; font-weight: bold; font-style: italic; text-decoration: underline;">${mentionedSkill.title}</a>`;

    if (trainerMatch) {
      reply = reply.replace(mentionedSkill.title, `${mentionedSkill.title} skill, which I teach.`);
    } else {
      reply = reply.replace(mentionedSkill.title, linkHTML);
    }

    // Append brief + Try it link
    reply += ` ${mentionedSkill.brief} <a href="${skillLink}" style="color: #003049; font-weight: bold; font-style: italic; text-decoration: underline;">Try it</a>`;

    return reply;
  } catch (err) {
    console.error("🔥 AI Fetch Exception:", err);
    return "Sorry, I ran into a problem trying to help you. Try again in a bit.";
  }
}