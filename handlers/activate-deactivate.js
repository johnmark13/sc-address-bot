const sc = require("sourcecred").sourcecred;
const {getDiscordAddressFromId} = require("../util.js")
const configs = require("../config.js")
const commandConstants = require("../commandConstants.js")

module.exports = {
    activateHandler: async (intMember, intData) => {
        const config = configs.GUILD_IDS[intData.guild_id];

        if (!config) {
            return "Self ativation not correctly configured for this server, check guild setup";
        }

        try {
            const ledgerManager = new sc.ledger.manager.LedgerManager({storage: new sc.ledger.storage.WritableGithubStorage({apiToken: process.env.GITHUB_SECRET, repo: config.repo, branch: config.branch})});

            const discordAddress = getDiscordAddressFromId(intMember.user.id, false);

            await ledgerManager.reloadLedger();

            const account = ledgerManager.ledger.accountByAddress(discordAddress);

            const uuid = account.identity.id;
            const oldLength = ledgerManager.ledger.eventLog().length;

            ledgerManager.ledger.activate(uuid);
            const result = ledgerManager.ledger.eventLog().length > oldLength ? await ledgerManager.persist() : {}
            
            if (result.error) {
                return "Could not activate address: " + result.error.toString();
            }

            return `Successfully activated ${account.identity.name}. Note, you might start receiving airdrops automatically.`;
        } catch (e) {
            return `Failed with message: ` + e;
        }
    },
    deactivateHandler: async (intMember, intData) => {
        const config = configs.GUILD_IDS[intData.guild_id];

        if (!config) {
            return "Self ativation not correctly configured for this server, check guild setup";
        }

        try {
            const ledgerManager = new sc.ledger.manager.LedgerManager({storage: new sc.ledger.storage.WritableGithubStorage({apiToken: process.env.GITHUB_SECRET, repo: config.repo, branch: config.branch})});

            const discordAddress = getDiscordAddressFromId(intMember.user.id, false);

            await ledgerManager.reloadLedger();

            const account = ledgerManager.ledger.accountByAddress(discordAddress);
            
            const uuid = account.identity.id;
            const oldLength = ledgerManager.ledger.eventLog().length;

            ledgerManager.ledger.deactivate(uuid);
            const result = ledgerManager.ledger.eventLog().length > oldLength ? await ledgerManager.persist() : {}
            
            if (result.error) {
                return "Could not deactivate address: " + result.error.toString();
            }

            return `Successfully deactivated ${account.identity.name}.`;
        } catch (e) {
            return `Failed with message: ` + e;
        }
    }
}