import dotenv from "dotenv";

dotenv.config();

const configs = {
  openAiApiKey: process.env.OPENAI_API_KEY,
  discordBotToken: process.env.DISCORD_BOT_TOKEN,
  personalServerId: process.env.PERSONAL_SERVER_ID,
  channelIdsToGetDataFrom: process.env.CHANNEL_IDS_TO_GET_DATA_FROM.split(","),
};

export default Object.freeze(configs);
