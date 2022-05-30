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
            //{"action":{"identity":{"address":"N\u0000sourcecred\u0000core\u0000IDENTITY\u00003dv3p6wrAR6NJrrgNFrHnA\u0000","aliases":[],"id":"3dv3p6wrAR6NJrrgNFrHnA","name":"johnmark13-discourse","subtype":"USER"},"type":"CREATE_IDENTITY"},"ledgerTimestamp":1653185700387,"uuid":"iRVXYBMoADIvsNxO5KKxSw","version":"1"}
            //{"action":{"alias":{"address":"N\u0000sourcecred\u0000discourse\u0000user\u0000https://forum.nation3.org\u0000johnmark13\u0000","description":"discourse/[@johnmark13](https://forum.nation3.org/u/johnmark13/)"},"identityId":"3dv3p6wrAR6NJrrgNFrHnA","type":"ADD_ALIAS"},"ledgerTimestamp":1653185700388,"uuid":"yFzkuGYWZnt9Wu9D2msL3g","version":"1"}
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