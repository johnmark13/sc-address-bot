const sc = require("sourcecred").sourcecred;
const {makeSureUserExistsAndGetId, getDiscourseAddressFromId} = require("../util.js")
const configs = require("../config.js")
const commandConstants = require("../commandConstants.js")

module.exports = {
    setDiscourseHandler: async (intMember, intData) => {
        const usernameElement = intData.options[0];
        const discourseUsername = usernameElement.value;
        const guildid = intData.guild_id;
        const config = configs.GUILD_IDS[guildid];

        if (!config) {
            return "Self ativation not correctly configured for this server, check guild setup";
        }

        try {
            const ledgerManager = new sc.ledger.manager.LedgerManager({storage: new sc.ledger.storage.WritableGithubStorage({apiToken: process.env.GITHUB_SECRET, repo: config.repo, branch: config.branch})})
            await ledgerManager.reloadLedger();
            const baseIdentityId = makeSureUserExistsAndGetId(ledgerManager, intMember);

            //Discourse Alias
            const discourseAddress = getDiscourseAddressFromId(discourseUsername, false);
            const discourseAlias = {
                address: discourseAddress,
                description: `discourse/[@${discourseUsername}](${config.discordbaseURL}/u/@${discourseUsername}/)`
              };    

              console.log(`Going to add Alias ${JSON.stringify(discourseAlias)}`);

            ledgerManager.ledger.addAlias(baseIdentityId, discourseAlias);

            console.log(`Added Alias`);

            const result = await ledgerManager.persist();

            if (result.error) {
                return "Could not save Discourse user: " + result.error.toString();
            }

            return `Success! Discourse user added to your Sourcecred account`;       
            
        } catch (e) {
            return `Failed with message: ` + e;
        }
    }
}