const config = require("./config.json");
const got = require("got");
const { CookieJar } = require("tough-cookie");
const { Client, Intents, MessageEmbed } = require("discord.js");

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const cookieJar = new CookieJar();
cookieJar.setCookieSync(`session=${config.sessionCookie}`, "https://adventofcode.com", { http: true, secure: true });

const cachedLeaderboard = {
  board: [],
  timestamp: new Date(0)
};

const updateLeaderboard = async () => {
  // Cache for 15 minutes
  const now = new Date();
  now.setMinutes(now.getMinutes() - 15);
  if (cachedLeaderboard.timestamp > now) {
    return;
  }

  // Fetch leaderboard
  const data = await got(`https://adventofcode.com/2021/leaderboard/private/view/${config.leaderboardId}.json`, { cookieJar }).json();
  
  // Format and sort data
  const board = Object.values(data.members);
  board.sort((a, b) => b.stars - a.stars);

  // Update cache
  cachedLeaderboard.board = board;
  cachedLeaderboard.timestamp = Date.now()
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === "leaderboard") {
    await updateLeaderboard();

    const embed = new MessageEmbed()
      .setTitle("Leaderboard")
      .addFields(cachedLeaderboard.board.map(v => { return { name: v.name, value: v.stars.toString(), inline: true } }))
      .setTimestamp(cachedLeaderboard.timestamp);
    
    await interaction.reply({ embeds: [embed] });
  }
});

client.login(config.token);