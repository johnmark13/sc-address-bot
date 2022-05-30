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
             //{"action":{"identity":{"address":"N\u0000sourcecred\u0000core\u0000IDENTITY\u0000VKoeRG5eG3wFrPwUP30quA\u0000","aliases":[],"id":"VKoeRG5eG3wFrPwUP30quA","name":"johnmark13-github","subtype":"USER"},"type":"CREATE_IDENTITY"},"ledgerTimestamp":1652751063468,"uuid":"l011nxUv5Cy7bsGjhgpZqw","version":"1"}
            //{"action":{"alias":{"address":"N\u0000sourcecred\u0000github\u0000USERLIKE\u0000USER\u0000johnmark13\u0000","description":"github/[@johnmark13](https://github.com/johnmark13)"},"identityId":"VKoeRG5eG3wFrPwUP30quA","type":"ADD_ALIAS"},"ledgerTimestamp":1652751063469,"uuid":"i57Hyx47nL5OUy01sxFqhA","version":"1"}
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