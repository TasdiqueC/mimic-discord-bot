import { OpenAI } from "openai";
import { getUserMessages } from "./database.js";
import { isRateLimited } from "./rateLimiter.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const model = "gpt-4o";

export const generateMimicResponse = async (serverId, userId, prompt) => {
  if (isRateLimited(userId))
    return "You're making too many requests! Try again later.";

  const userMessages = await getUserMessages(serverId, userId);
  if (userMessages.length === 0)
    return "I don't know their style yet! Send more messages.";

  const context = userMessages.join("\n");
  const gptPrompt = `This user typically speaks like this:\n${context}\nNow respond in their style to: ${prompt}`;

  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: "Mimic the user's style." },
      { role: "user", content: gptPrompt },
    ],
  });

  return response.choices[0].message.content;
};

export const generateJoke = async (serverId, userId) => {
  if (isRateLimited(userId))
    return "You're making too many requests! Try again later.";

  const userMessages = await getUserMessages(serverId, userId);
  if (userMessages.length === 0)
    return "I don't know their humor yet! Send more messages.";

  const context = userMessages.join("\n");
  const gptPrompt = `This user typically speaks like this:\n${context}\nNow tell a joke in their style.`;

  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: "Mimic the user's humor and tell a joke." },
      { role: "user", content: gptPrompt },
    ],
  });

  return response.choices[0].message.content;
};
