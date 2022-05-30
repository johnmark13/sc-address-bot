const sc = require("sourcecred").sourcecred;
const {getDiscordAddressFromId} = require("../util.js")
const configs = require("../config.js")
const commandConstants = require("../commandConstants.js")

module.exports = {
    activateHandler: async (intMember, intData) => {
        const config = configs.GUILD_IDS[intData.guild_id];

        /**
         * {"action":{"identity":{"address":"N\u0000sourcecred\u0000core\u0000IDENTITY\u0000VKoeRG5eG3wFrPwUP30quA\u0000","aliases":[],"id":"VKoeRG5eG3wFrPwUP30quA","name":"johnmark13-github","subtype":"USER"},"type":"CREATE_IDENTITY"},"ledgerTimestamp":1652751063468,"uuid":"l011nxUv5Cy7bsGjhgpZqw","version":"1"}
{"action":{"alias":{"address":"N\u0000sourcecred\u0000github\u0000USERLIKE\u0000USER\u0000johnmark13\u0000","description":"github/[@johnmark13](https://github.com/johnmark13)"},"identityId":"VKoeRG5eG3wFrPwUP30quA","type":"ADD_ALIAS"},"ledgerTimestamp":1652751063469,"uuid":"i57Hyx47nL5OUy01sxFqhA","version":"1"}
{"action":{"identityId":"YyaPBIqfKzBtKNLYycza4w","type":"TOGGLE_ACTIVATION"},"ledgerTimestamp":1652751313281,"uuid":"r6kqca2rTaaZNXSN1Gn3vw","version":"1"}
         */

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