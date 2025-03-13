# Discord Mimic Bot

## Overview

This project is mostly an experiment for me thus far. It scratches the itch for me in that it helps me learn how to make deployable Discord bots and how to use ChatGPT.

It is not yet complete, but the desired functionality is as such:

- **Mimic users** based on their past messages (`!mimic @user [message]`)
- **Generate jokes** in a user’s style (`!joke @user`)
- **Fetch and store all past messages** from all channels (`!fetchmessages`)
- **Automatically store all messages** for training responses
- **Rate-limit API calls** to avoid overuse

This bot uses **OpenAI's GPT-4o** to analyze and generate responses while storing past messages in an **SQLite database**.

---

## Project Structure

```
/discord-bot
│── /src
│   │── bot.js                # Main bot file (entry point)
│   │── commands.js           # Handles text-based commands
│   │── database.js           # Manages message storage
│   │── openai.js             # Handles OpenAI API requests
│   │── rateLimiter.js        # Rate limiting for API calls
│── .env                      # Stores bot token and API key
│── package.json              # Project dependencies
│── README.md                 # Documentation
```

---

## Setup & Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a **.env** file.

Here are the environment variables and what they represent:

- DISCORD_BOT_TOKEN: The discord bot token; this is what helps set up a client to connect to a deployed Discord bot.
- OPENAI_API_KEY: The OpenAI API key. This helped connect to OpenAI and call chatGPT.
- PERSONAL_SERVER_ID: This is likely a temporary environment variable, but it helped me isolate the Bot to only work in my server. Discord only allows for bots to be added to servers if they're public, so I had to add a stop-gap like this. The main purpose is to stop unexpected people from abusing my OpenAI API key for this rudimentary first iteration.
- CHANNEL_IDS_TO_GET_DATA_FROM: A CSV list of channel IDs that have the most data for all users.

### 3. Run the Bot

```bash
node src/bot.js
```

---

## Commands

| Command                  | Description                                            |
| ------------------------ | ------------------------------------------------------ |
| `!mimic @user [message]` | Mimics a user's style based on past messages           |
| `!joke @user`            | Generates a joke in the user's style                   |
| `!fetchmessages`         | Fetches and stores all past messages from all channels |

---

## How It Works

### `bot.js` (Main File)

- Initializes the bot
- Listens for messages and commands

### `commands.js` (Handles Commands)

- Parses text-based commands

### `database.js` (Stores Messages)

- Uses SQLite to store user messages
- Fetches past messages for training GPT

### `openai.js` (GPT-4o Integration)

- Sends requests to OpenAI’s API
- Generates responses based on past messages

### `rateLimiter.js` (Prevents API Spam)

- Limits the number of API calls per user
- Ensures cost control and stability

---

## License

This bot is open-source under the **MIT License**.

---

## Future Improvements (If I have time for this)

- Learn more about ChatGPT and see if I can create isolated instances of ChatGPT for each user, so I can train the individuals.
- Create a true DB so I don't have to fetch all messages each time.
