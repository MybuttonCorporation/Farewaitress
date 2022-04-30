const discord = require('discord.js')
module.exports = {
    name: "terminate",
    info: "Terminates a user from using the bot for ALL SERVERS.",
    requests: "OWNER",
    async run (client, message, args, serverDatabase = null) {
        const user = message.mentions.users.first()
        if (!user) return message.reply(new discord.MessageEmbed({description: `> the value \`peasant USER\` was not specified.`, color: 'RED'}))
        if (user.id == message.author.id) return message.reply(new discord.MessageEmbed({description: `> you cannot terminate yourself.`, color: 'RED'}))
        if (user.id == client.user.id) return message.reply(new discord.MessageEmbed({description: `> you cannot terminate the bot.`, color: 'RED'}))
        //check if the user defined a reason
        if (!args[2]) return message.reply(new discord.MessageEmbed({description: `> the value \`string reason\` was not specified.`, color: 'RED'}))
        //terminate the user from all servers
        const guilds = client.guilds.cache.array()
        const db = require('wio.db')
        console.log(__dirname)
        const Database = new db.Database(`./config/blacklist.json`)
        //
        if (!Database.has("blacklist")) Database.set("blacklist", [])
        if (!Database.has("blacklist_reasons")) Database.set("blacklist_reasons", [])
        //check if the user is already blacklisted and if so notify the user
        if (Database.arrayHasValue("blacklist", user.id)) return message.reply(new discord.MessageEmbed({description: `> the user \`${user.tag}\` is already blacklisted.`, color: 'RED'}))
        
        Database.push("blacklist", user.id)
        Database.set("reason_" + message.author.id, message.content.replace(`${serverDatabase.get("prefix")}admin/terminate ${args[1]}`, ""))
        //notify 
        message.channel.send(new discord.MessageEmbed({description: `> the user \`${user.tag}\` has been blacklisted.`, color: 'BLUE'}))
        //notify the user
        try {
        user.send(new discord.MessageEmbed({description: `> You were blacklisted from using Farewaitress by \`FarewellNehir\`.\n__Reason__\n${message.content.replace(`${serverDatabase.get("prefix")}admin/terminate ${args[0]} `, "")}`, color: 'RED'}))
        } catch (err) {
        console.log("Attempted to message someone but failed, probably because they have DMs disabled.")
        }
    }
}