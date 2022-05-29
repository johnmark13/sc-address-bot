require('dotenv').config();
const express = require('express');
const {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} = require('discord-interactions');
const verifyKeyMiddleware = require('discord-interactions').verifyKeyMiddleware;

const commandConstants = require("./commandConstants.js");

const env = process.env;
const BOT_SECRET = env.BOT_SECRET;

const {setAddressHandler} = require("./handlers/setAddress.js");
const {activateHandler, deactivateHandler} = require("./handlers/activate-deactivate.js");

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), async function (req, res) {
  // Interaction type and data
  const { type, member, data } = req.body;

  console.log("Something happened: " + JSON.stringify(req.body));
  // https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object
  /**{
   *    "application_id":"979772084739797032",
   *    "channel_id":"980216321130266624",
   *    "data":{
   *        "guild_id":"956551108061446244",
   *        "id":"979772431956861018",
   *        "name":"setpayoutaddress",
   *        "options":[{"name":"address","type":3,"value":"Oxfad3.eth"}],
   *        "type":1
   *    },
   *    "guild_id":"956551108061446244",
   *    "guild_locale":"en-US",
   *    "id":"980495342044860456",
   *    "locale":"en-GB",
   *    "member":{"avatar":null,"communication_disabled_until":null,"deaf":false,"flags":0,"is_pending":false,"joined_at":"2022-03-24T13:52:36.076000+00:00","mute":false,"nick":null,"pending":false,"permissions":"4398046511103","premium_since":null,"roles":["956560281868316672","956560171281285190"],"user":{"avatar":"e782416d13a94105dc10158c20ad96ae","avatar_decoration":null,"discriminator":"0838","id":"907282205347295302","public_flags":0,"username":"JohnMark13"}},"token":"aW50ZXJhY3Rpb246OTgwNDk1MzQyMDQ0ODYwNDU2OjI0aWR2Sjl1OTNkQU5leWJJM1FUTzI5N0RWazNLUk1IZVg3SW5CYngyalVyYXVUUU9nQnFXeE0xZ2JScjJhSU9kMnlRT3BWTVcxYlpPZE0wV3dkTzJZR0FCY2FKZ1EzTllVYUZPTWpGY1cxaFZZN3FpU1d1ekNTM3BFckM1MzVZ","type":2,"version":1
   * }
   * 
  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    let resp = "That didn't work";

    if (name === commandConstants.SET_ADDRESS_NAME) {
      resp = (await setAddressHandler(member, data));
    }
    else if (name === commandConstants.ACTIVATE_NAME) {
        resp = (await activateHandler(member, data));
    }
    else if (name === commandConstants.DEACTIVATE_NAME) {
        resp = (await deactivateHandler(member, data));
    }


     // Send a message into the channel where command was triggered from
     return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: resp
        },
      });
    }});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});