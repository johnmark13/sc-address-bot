const sc = require("sourcecred").sourcecred;

module.exports = {
    getDiscordAddressFromId: (discordUserId, isBot) => {
        return sc.core.graph.NodeAddress.fromParts([
            "sourcecred",
            "discord",
            "MEMBER",
            isBot ? "bot" : "user",
            discordUserId
        ]);
    },

    getDiscourseAddressFromId: (discordUserId, isBot) => {
        return sc.core.graph.NodeAddress.fromParts([
            "sourcecred",
            "discord",
            "MEMBER",
            isBot ? "bot" : "user",
            discordUserId
        ]);
    },

    getGithubAddressFromId: (discordUserId, isBot) => {
        return sc.core.graph.NodeAddress.fromParts([
            "sourcecred",
            "discord",
            "MEMBER",
            isBot ? "bot" : "user",
            discordUserId
        ]);
    }
};