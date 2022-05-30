const sc = require("sourcecred").sourcecred;
const {getDiscordAddressFromId} = require("../util.js")
const configs = require("../config.js")
const commandConstants = require("../commandConstants.js")

module.exports = {
    setAddressHandler: async (intMember, intData) => {
        const addressElement = intData.options[0];
        const address = addressElement.value;
        const guildid = intData.guild_id;
        const config = configs.GUILD_IDS[guildid];

        if (!config) {
            return "Self ativation not correctly configured for this server, check guild setup";
        }

        try {
            const ledgerManager = new sc.ledger.manager.LedgerManager({storage: new sc.ledger.storage.WritableGithubStorage({apiToken: process.env.GITHUB_SECRET, repo: config.repo, branch: config.branch})})
            await ledgerManager.reloadLedger()
            
            console.log(`Setting the ball rolling for ${intMember.user.username}`);

            const baseIdentityProposal = sc.plugins.discord.utils.identity.createIdentity(
                intMember.user.username
            );

            console.log("Porposal created");

            const baseIdentityId = sc.ledger.utils.ensureIdentityExists(
                ledgerManager.ledger,
                baseIdentityProposal,
            );

            console.log(`Base Identity ID ${JSON.stringify(baseIdentityId)}`);

            //discord Alias
            const discordAddress = getDiscordAddressFromId(intMember.user.username, false);
            const discordAlias = {
                address: discordAddress,
                description: `discord/${intMember.user.usename}#${intMember.user.discriminator}`
              };    

              console.log(`Going to add Alias ${JSON.stringify(discordAlias)}`);

            ledgerManager.ledger.addAlias(baseIdentityId, discordAlias);

            console.log(`Added Alias`);

            //intMember.user.discriminator
            //{"action":{"identity":{"address":"N\u0000sourcecred\u0000core\u0000IDENTITY\u0000a5tJVT4CBbEWJaXsngglKw\u0000","aliases":[],"id":"a5tJVT4CBbEWJaXsngglKw","name":"JohnMark13","subtype":"USER"},"type":"CREATE_IDENTITY"},"ledgerTimestamp":1652442119715,"uuid":"8q5D883QieY9DvkB51kxZw","version":"1"}
            //{"action":{"alias":{"address":"N\u0000sourcecred\u0000discord\u0000MEMBER\u0000user\u0000907282205347295302\u0000","description":"discord/JohnMark13#0838"},"identityId":"a5tJVT4CBbEWJaXsngglKw","type":"ADD_ALIAS"},"ledgerTimestamp":1652442119715,"uuid":"PGCZ10fvIPmQsED1xJf9nQ","version":"1"}
            
            //{"action":{"identity":{"address":"N\u0000sourcecred\u0000core\u0000IDENTITY\u0000VKoeRG5eG3wFrPwUP30quA\u0000","aliases":[],"id":"VKoeRG5eG3wFrPwUP30quA","name":"johnmark13-github","subtype":"USER"},"type":"CREATE_IDENTITY"},"ledgerTimestamp":1652751063468,"uuid":"l011nxUv5Cy7bsGjhgpZqw","version":"1"}
            //{"action":{"alias":{"address":"N\u0000sourcecred\u0000github\u0000USERLIKE\u0000USER\u0000johnmark13\u0000","description":"github/[@johnmark13](https://github.com/johnmark13)"},"identityId":"VKoeRG5eG3wFrPwUP30quA","type":"ADD_ALIAS"},"ledgerTimestamp":1652751063469,"uuid":"i57Hyx47nL5OUy01sxFqhA","version":"1"}
            //{"action":{"identity":{"address":"N\u0000sourcecred\u0000core\u0000IDENTITY\u00003dv3p6wrAR6NJrrgNFrHnA\u0000","aliases":[],"id":"3dv3p6wrAR6NJrrgNFrHnA","name":"johnmark13-discourse","subtype":"USER"},"type":"CREATE_IDENTITY"},"ledgerTimestamp":1653185700387,"uuid":"iRVXYBMoADIvsNxO5KKxSw","version":"1"}
            //{"action":{"alias":{"address":"N\u0000sourcecred\u0000discourse\u0000user\u0000https://forum.nation3.org\u0000johnmark13\u0000","description":"discourse/[@johnmark13](https://forum.nation3.org/u/johnmark13/)"},"identityId":"3dv3p6wrAR6NJrrgNFrHnA","type":"ADD_ALIAS"},"ledgerTimestamp":1653185700388,"uuid":"yFzkuGYWZnt9Wu9D2msL3g","version":"1"}

            // ethAddress = sc.plugins.ethereum.utils.address.parseAddress(address);
            //const account = ledgerManager.ledger.accountByAddress(ethAlias.address);

            //const uuid = account.identity.id

            

            //create github identity / alias
            //create discourse identity / alias
            //set address

            //sc.plugins.ethereum.utils.address.

            console.log(`SC account already exists, updating payout address: ${baseIdentityId} - ${address}`);
            ledgerManager.ledger.setPayoutAddress(uuid, address, config.chainId, config.tokenAddress)
            const result = await ledgerManager.persist();

            if (result.error) {
                return "Could not save address: " + result.error.toString();
            }

            return `Success!\n**New payout address:** ${address}\n**Account:** ${account.identity.name}\n**Chain Id:** ${config.chainId}\n**Token Address:** ${config.tokenAddress}`;       
            
        } catch (e) {
            return `Failed with message: ` + e;
        }
    }
}