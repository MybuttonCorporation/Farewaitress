const discord = require('discord.js')
module.exports = {
    name: "modifyconfig",
    info: "Modifies a cvar of a server or modifies variables.",
    requests: "OWNER",
    version: ["beta", "dev", "latest"],
    async run (client, message, args, serverDatabase = null) {
        //check if arguements are specified
        if (!args[0]) return message.reply(new discord.MessageEmbed({description: `> the value of \`id server_id\` is null.`, color: 'RED'}))
        //check if args[1] is specified, if not tell
        if (!args[1]) return message.reply(new discord.MessageEmbed({description: `> the value \`cvar key\` was not specified.`, color: 'RED'}))
        //check if args[2] is specified, if not tell
        if (!args[2]) return message.reply(new discord.MessageEmbed({description: `> the value \`object value\` was not specified.`, color: 'RED'}))
        //check if the server exists
        if (!client.guilds.cache.get(args[0])) return message.reply(new discord.MessageEmbed({description: `> the server with the id \`${args[0]}\` does not exist.`, color: 'RED'}))
        //add the value to the database of the specified server id (args[0])
        const configuration = require('wio.db')
        const db = new configuration.Database("./config/" + args[0] + ".json");
        db.set(args[1], args[2]);
        message.channel.send(new discord.MessageEmbed({description: `> Configuration of the server \`${args[0]}\` changed.\n\`\`\`json\n{\n//...\n"${args[1]}": "${args[2]}"\n}\`\`\``, color: 'BLUE'}))
    }
}
