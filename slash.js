const config = require("./config.json");
const { REST, Routes } = require("discord.js");

const commands = [{
  name: "leaderboard",
  description: "Shows the current leaderboard"
}]; 

const rest = new REST({ version: "10" }).setToken(config.token);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(
      Routes.applicationGuildCommands(config.applicationId, config.guildId),
      { body: commands },
    );

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();