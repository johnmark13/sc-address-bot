const sc = require("sourcecred").sourcecred;
const {makeSureUserExistsAndGetId, getGithubAddressFromId} = require("../util.js")
const configs = require("../config.js")
const commandConstants = require("../commandConstants.js")

module.exports = {
    setGithubHandler: async (intMember, intData) => {
        const usernameElement = intData.options[0];
        const githubUsername = usernameElement.value;
        const guildid = intData.guild_id;
        const config = configs.GUILD_IDS[guildid];

        if (!config) {
            return "Self ativation not correctly configured for this server, check guild setup";
        }

        try {
            const ledgerManager = new sc.ledger.manager.LedgerManager({storage: new sc.ledger.storage.WritableGithubStorage({apiToken: process.env.GITHUB_SECRET, repo: config.repo, branch: config.branch})})
            await ledgerManager.reloadLedger();
            const baseIdentityId = makeSureUserExistsAndGetId(ledgerManager, intMember);

            //Github Alias
            const githubAddress = getGithubAddressFromId(githubUsername, false);
            const githubAlias = {
                address: githubAddress,
                description: `github/[@${githubUsername}](https://github.com/${githubUsername})`
              };    

              console.log(`Going to add Alias ${JSON.stringify(githubAlias)}`);

            ledgerManager.ledger.addAlias(baseIdentityId, githubAlias);

            console.log(`Added Alias`);

            const result = await ledgerManager.persist();

            if (result.error) {
                return "Could not save Github user: " + result.error.toString();
            }

            return `Success! Github user added to your Sourcecred account`;       
            
        } catch (e) {
            return `Failed with message: ` + e;
        }
    }
}