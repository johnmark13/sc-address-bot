const sc = require("sourcecred").sourcecred;
const {makeSureUserExistsAndGetId, getDiscordAddressFromId} = require("../util.js")
const configs = require("../config.js")
const commandConstants = require("../commandConstants.js")

module.exports = {
    setAddressHandler: async (interaction) => {
        const address = interaction.options.getString(commandConstants.SET_ADDRESS_PARAM);
        const guildid = interaction.guildId;
        const config = configs.GUILD_IDS[guildid];

        if (!config) {
            return "Self ativation not correctly configured for this server, check guild setup";
        }

        try {
            const ledgerManager = new sc.ledger.manager.LedgerManager({storage: new sc.ledger.storage.WritableGithubStorage({apiToken: process.env.GITHUB_SECRET, repo: config.repo, branch: config.branch})})
            await ledgerManager.reloadLedger();
            const baseIdentityId = makeSureUserExistsAndGetId(ledgerManager, interaction.member);

            const discordAddress = getDiscordAddressFromId(interaction.member.user.username, false);
            const discordAlias = {
                address: discordAddress,
                description: `discord/${interaction.member.user.username}#${interaction.member.user.discriminator}`
              };    

              console.log(`Going to add Alias ${JSON.stringify(discordAlias)}`);

            ledgerManager.ledger.addAlias(baseIdentityId, discordAlias);

            console.log(`Added Alias`);

            //github alias
             

            //intMember.user.discriminator
            //{"action":{"identity":{"address":"N\u0000sourcecred\u0000core\u0000IDENTITY\u0000a5tJVT4CBbEWJaXsngglKw\u0000","aliases":[],"id":"a5tJVT4CBbEWJaXsngglKw","name":"JohnMark13","subtype":"USER"},"type":"CREATE_IDENTITY"},"ledgerTimestamp":1652442119715,"uuid":"8q5D883QieY9DvkB51kxZw","version":"1"}
            //{"action":{"alias":{"address":"N\u0000sourcecred\u0000discord\u0000MEMBER\u0000user\u0000907282205347295302\u0000","description":"discord/JohnMark13#0838"},"identityId":"a5tJVT4CBbEWJaXsngglKw","type":"ADD_ALIAS"},"ledgerTimestamp":1652442119715,"uuid":"PGCZ10fvIPmQsED1xJf9nQ","version":"1"}

            console.log(`Checking if address already linked: ${baseIdentityId} - ${address}`);

            const linkedAccount = manager.ledger.accountByAddress(sc.plugins.ethereum.utils.address.nodeAddressForEthAddress(address),);

            console.log("IS there: " + linkedAccount);
            if (linkedAccount) {
                console.log(`Eth address linked to existing SC account, is it us?: ${JSON.stringify(baseIdentityId)} - ${JSON.stringify(address)}`);

            }
            ledgerManager.ledger.setPayoutAddress(baseIdentityId, address, config.chainId, config.tokenAddress)
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