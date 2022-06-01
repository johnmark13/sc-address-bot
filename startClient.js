const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const commandConstants = require("./commandConstants.js")
require('dotenv').config();

const dotenv = require("dotenv")
dotenv.config()

const env = process.env;
const BOT_SECRET = env.BOT_SECRET;

const {setAddressHandler} = require("./handlers/setAddress.js")
const {activateHandler, deactivateHandler} = require("./handlers/activate-deactivate.js")

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
  if (interaction.commandName === commandConstants.SET_ADDRESS_NAME) {
    console.log("Sett address");
    await interaction.deferReply();
    console.log("Deferred reply");
    const resp = await setAddressHandler(interaction);
    console.log("Got a respose: " + resp);
    await interaction.editReply({content: resp});
  }
  if (interaction.commandName === commandConstants.ACTIVATE_NAME)
    activateHandler(interaction)
  if (interaction.commandName === commandConstants.DEACTIVATE_NAME)
    deactivateHandler(interaction)
});

client.login(BOT_SECRET);