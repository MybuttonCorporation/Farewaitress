const discord = require('discord.js')
const fs = require('fs')
module.exports = {
    name: "command-info",
    info: "gives information about a specific command",
    requests: "NONE",
    async run (client, message, args, serverDatabase = null) {
        if (message.content == serverDatabase.get("prefix") + "command-info") return message.reply(new discord.MessageEmbed({description: `> the value \`string commandName\` was not specified.`, color: 'RED'}))

        try {
            const cmd = require(`./${args[0]}.js`);
            message.channel.send(new discord.MessageEmbed({ 
            description: `
                > **Command Information**
                __Command Name__:\`${cmd.name}\`
                __Permissions__: \`${cmd.requests}\`
                __Description__: \`${cmd.info}\`
                `, color: 'BLUE'
            }))
        } catch (err) {
        message.reply(new discord.MessageEmbed({description: `The command \`${args[0]}\` does not exist.`, color: 'RED'}))
        }
    }
}