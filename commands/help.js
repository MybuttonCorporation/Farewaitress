const discord = require('discord.js') 

module.exports = {
    name: "help",
    requests: "SEND_MESSAGES",
    info: "Gives help about a command or lists them",
    async run (client, message, args, serverDatabase = null) {
    //list all the commands in an embed and send it
        if (message.content == "%help") {
            message.channel.send(new discord.MessageEmbed({description: `
            > **Available commands**
            \`${serverDatabase.get("prefix")}help\` - gives help about a command or lists all commands
            \`${serverDatabase.get("prefix")}server\` - changes a cvar of a server or modifies variables
            \`${serverDatabase.get("prefix")}command-info\` - gives information about a command
            \`${serverDatabase.get("prefix")}ban\` - bans a user


            > **Available actions**
            \`fws.reset prefix\` - resets the server prefix to \`%\`
            \`fws.reset blacklist\` - empties the server blacklist
            \`fws.reset\` - resets all the cvars to their default values
            \`fws.loadbackup\` - loads a backup config as a server config
            \`fws.savebackup\` - saves the current server config as a backup config

            > **Available Admin Commands**
            \`${serverDatabase.get("prefix")}admin/hold\` - Puts a user account on hold / removes it from hold
            \`${serverDatabase.get("prefix")}admin/announce\` - announces a message to all members
            \`${serverDatabase.get("prefix")}admin/terminate\` - Terminates a user from using the bot

            `, color: 'BLUE'}))
            return;
        }
    }
}