require('dotenv').config();
const express = require('express');
const {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} = require('discord-interactions');
const verifyKey = require('discord-interactions').verifyKey;

const commandConstants = require("./commandConstants.js");

const env = process.env;
const BOT_SECRET = env.BOT_SECRET;

const {setAddressHandler} = require("./handlers/setAddress.js");
const {activateHandler, deactivateHandler} = require("./handlers/activate-deactivate.js");

function VerifyDiscordRequest(clientKey) {
    return function (req, res, buf, encoding) {
      const signature = req.get('X-Signature-Ed25519');
      const timestamp = req.get('X-Signature-Timestamp');
  
      const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
      if (!isValidRequest) {
        res.status(401).send('Bad request signature');
        throw new Error('Bad request signature');
      }
    };
  }


// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));


/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post('/interactions', async function (req, res) {
  // Interaction type and data
  const { type, id, data } = req.body;

  console.log("Something happened: " + type);
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
      resp = "Set address please";
    }
    else if (name === commandConstants.ACTIVATE_NAME) {
        resp = resp = "Activate please";
    }
    else if (name === commandConstants.DEACTIVATE_NAME) {
        resp = resp = "Deactivate please";
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