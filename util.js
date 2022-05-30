const sc = require("sourcecred").sourcecred;

module.exports = {
    makeSureUserExistsAndGetId: (ledgerManager, intMember) => {
        console.log(`Setting the ball rolling for ${intMember.user.username}`);

        const baseIdentityProposal = sc.plugins.discord.utils.identity.createIdentity(
            intMember
        );

        console.log("Proposal created");

        const baseIdentityId = sc.ledger.utils.ensureIdentityExists(
            ledgerManager.ledger,
            baseIdentityProposal,
        );

        console.log(`Base Identity ID ${JSON.stringify(baseIdentityId)}`);

        return baseIdentityId;
    },
    getDiscordAddressFromId: (discordUserId, isBot) => {
        return sc.core.graph.NodeAddress.fromParts([
            "sourcecred",
            "discord",
            "MEMBER",
            isBot ? "bot" : "user",
            discordUserId
        ]);
    },

    getDiscourseAddressFromId: (discourseUsername, isBot) => {
        return sc.core.graph.NodeAddress.fromParts([
            "sourcecred",
            "discourse",
            isBot ? "bot" : "user",
            "https://forum.nation3.org",
            discourseUsername
        ]);
    },

    getGithubAddressFromId: (githubUsername, isBot) => {
        return sc.core.graph.NodeAddress.fromParts([
            "sourcecred",
            "github",
            "USERLIKE",
            isBot ? "bot" : "user",
            githubUsername
        ]);
    }
};