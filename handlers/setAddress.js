const sc = require("sourcecred").sourcecred;
const {getDiscordAddressFromId} = require("../util.js")
const configs = require("../config.js")
const commandConstants = require("../commandConstants.js")

module.exports = {
    setAddressHandler: async (intData) => {
        console.log("We've got: " + intData);
        return "allGood";
    }
}