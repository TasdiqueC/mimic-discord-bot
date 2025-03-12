import { Client, GatewayIntentBits } from "discord.js";
import { storeMessage } from "./database.js";
import configs from "./configs.js";
import { handleMessage } from "./commands.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  console.info("Guild ID", message.guildId);

  if (message.guildId !== configs.personalServerId) {
    return message.channel.send("You're not in the server I'm intended for");
  }

  if (message.author.bot) return;

  // Store all messages automatically
  storeMessage(
    message.guild.id,
    message.channel.id,
    message.author.id,
    message.author.username,
    message.content
  );

  // Handle text-based commands
  await handleMessage(message);
});

client.login(configs.discordBotToken);
