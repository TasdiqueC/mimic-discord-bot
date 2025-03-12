import sqlite3 from "sqlite3";
import configs from "./configs.js";

const db = new sqlite3.Database("messages.db", (err) => {
  if (err) console.error(err.message);
  console.log("Connected to the SQLite database.");
});

db.run(`CREATE TABLE IF NOT EXISTS messages (
  server_id TEXT,
  user_id TEXT,
  username TEXT,
  message TEXT
)`);

export const storeMessage = (serverId, userId, username, message) => {
  db.run(
    "INSERT INTO messages (server_id, user_id, username, message) VALUES (?, ?, ?, ?)",
    [serverId, userId, username, message],
    (err) => {
      if (err) console.error(err.message);
    }
  );
};

export const getUserMessages = (serverId, userId, limit = 50) => {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT message FROM messages WHERE server_id = ? AND user_id = ? ORDER BY rowid DESC LIMIT ?",
      [serverId, userId, limit],
      (err, rows) => {
        if (err) reject(err);
        resolve(rows.map((row) => row.message));
      }
    );
  });
};

export const storeBulkMessages = (messages) => {
  const stmt = db.prepare(
    "INSERT INTO messages (server_id, user_id, username, message) VALUES (?, ?, ?, ?)"
  );
  messages.forEach(({ serverId, userId, username, content }) => {
    stmt.run(serverId, userId, username, content);
  });
  stmt.finalize();
};

export const fetchAndStoreMessages = async (channel) => {
  let lastMessageId;
  const allMessages = [];

  try {
    while (true) {
      const messages = await channel.messages.fetch({
        limit: 100,
        before: lastMessageId,
      });
      if (messages.size === 0) break;

      messages.forEach((message) => {
        allMessages.push({
          serverId: message.guild.id,
          userId: message.author.id,
          username: message.author.username,
          content: message.content,
        });
      });

      lastMessageId = messages.last().id;
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Prevent rate limits
    }

    storeBulkMessages(allMessages);
    console.log(
      `Stored ${allMessages.length} past messages from #${channel.name}`
    );
  } catch (error) {
    console.error(`Error fetching messages from ${channel.name}:`, error);
  }
};

export const fetchAllChannelsMessages = async (guild) => {
  console.log(`Fetching messages for all channels in ${guild.name}...`);

  for (const channel of guild.channels.cache.values()) {
    // console.info("Channel ID", channel.id, configs.channelIdsToGetDataFrom);

    if (configs.channelIdsToGetDataFrom.includes(channel.id)) {
      if (channel.isTextBased()) {
        console.log(`Fetching messages from #${channel.name}`);
        await fetchAndStoreMessages(channel);
      }
    }
  }
};
