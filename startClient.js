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

client.on('message', async message => {
  console.log("Someone is talking to me: " + message.content);
});

client.on('interactionCreate', async interaction => {
  console.log("Someone is interracting with me: " + interraction.content);
  if (!interaction.isCommand()) return;
  if (interaction.commandName === commandConstants.SET_ADDRESS_NAME) {
    await interaction.deferReply();
    const resp = setAddressHandler(interaction);
    await interaction.editReply({content: resp});

  if (interaction.commandName === commandConstants.ACTIVATE_NAME)
    activateHandler(interaction)
  if (interaction.commandName === commandConstants.DEACTIVATE_NAME)
    deactivateHandler(interaction)
});

client.login(BOT_SECRET);