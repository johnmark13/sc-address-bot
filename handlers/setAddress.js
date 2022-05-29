const sc = require("sourcecred").sourcecred;
const {getDiscordAddressFromId} = require("../util.js")
const configs = require("../config.js")
const commandConstants = require("../commandConstants.js")

module.exports = {
    setAddressHandler: (intData) => {
        console.log("We've got: " + intData.id + " : " + intData.options.name + " : " + intData.options.value);
        //{"guild_id":"956551108061446244","id":"979772431956861018","name":"setpayoutaddress","options":[{"name":"address","type":3,"value":"Dave"}],"type":1}
        return "allGood";
    }
}