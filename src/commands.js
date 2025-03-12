import { fetchAllChannelsMessages } from "./database.js";
import { generateMimicResponse, generateJoke } from "./openai.js";

const commandTitles = {
  fetchMessages: "!fetchmessages",
  mimic: "!mimic",
  joke: "!joke",
};

export const handleMessage = async (message) => {
  try {
    const args = message.content.split(" ");
    const command = args.shift().toLowerCase();

    if (command === commandTitles.fetchMessages) {
      await message.channel.send(
        "Fetching all previous messages in the server..."
      );
      await fetchAllChannelsMessages(message.guild);
      await message.channel.send("Finished fetching messages!");
    }

    if (command === commandTitles.mimic) {
      if (args.length < 2) {
        return message.channel.send("Usage: `!mimic @user [message]`");
      }
      const user = message.mentions.users.first();
      if (!user) return message.channel.send("You must tag a user to mimic!");

      const prompt = args.slice(1).join(" ");
      const response = await generateMimicResponse(
        message.guild.id,
        user.id,
        prompt
      );
      await message.channel.send(response);
    }

    if (command === commandTitles.joke) {
      if (args.length < 1) {
        return message.channel.send("Usage: `!joke @user`");
      }
      const user = message.mentions.users.first();
      if (!user)
        return message.channel.send("You must tag a user to generate a joke!");

      const joke = await generateJoke(message.guild.id, user.id);
      await message.channel.send(joke);
    }
  } catch (error) {
    console.error("Error", error);
  }
};
