const { Client } = require("discord.js");
const { makeRedditCall } = require("./utils");

const client = new Client();

const prefix = "!reddit";

client.on("message", async (msg) => {
  if (msg.author.bot) return;

  if (!msg.content.startsWith("!")) return;

  const commandBody = msg.content.slice(prefix.length);

  const args = commandBody.split(" ");

  const subreddit = args[2].toLowerCase();
  const command = args[1].toLowerCase();

  if (command === "top" || command === "random") {
    const embed = await makeRedditCall(command, subreddit);
    msg.channel.startTyping();
    msg.channel.send({ embed });
    msg.channel.stopTyping();
    return;
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
