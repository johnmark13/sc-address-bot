const sc = require("sourcecred").sourcecred;
const {getDiscordAddressFromId} = require("../util.js")
const configs = require("../config.js")
const commandConstants = require("../commandConstants.js")

module.exports = {
    setAddressHandler: async (intMember, intData) => {
        const addressElement = intData.options[0];
        const address = addressElement.value;
        const guildid = intData.guild_Id;

        console.log(`Setting member address for: ${guildid}`);
        const config = configs.GUILD_IDS[guildid];

        if (!config) {
            return "Self ativation not correctly configured for this server, check guild setup";
        }

        try {
            const ledgerManager = new sc.ledger.manager.LedgerManager({storage: new sc.ledger.storage.WritableGithubStorage({apiToken: process.env.GITHUB_SECRET, repo: config.repo, branch: config.branch})})
            await ledgerManager.reloadLedger()
            const discordAddress = getDiscordAddressFromId(intMember.user.id, false)
            const account = ledgerManager.ledger.accountByAddress(discordAddress)
            const uuid = account.identity.id
            ledgerManager.ledger.setPayoutAddress(uuid, address, config.chainId, config.tokenAddress)
            const result = await ledgerManager.persist()
            if (result.error) {
                return "Could not save address: " + result.error.toString();
            }

            return `Success!\n**New payout address:** ${address}\n**Account:** ${account.identity.name}\n**Chain Id:** ${config.chainId}\n**Token Address:** ${config.tokenAddress}`;
        } catch (e) {
            return `Failed with message: ` + e;
        }
    }
}