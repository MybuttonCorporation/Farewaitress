const discord = require('discord.js') 
module.exports = {
    name: "announce",
    info: "Announces a message to all members.",
    requests: "OWNER",
    version: ["beta"],
    async run (client, message, args, serverDatabase = null) {
        //check if the message includes anything other than the command
        if (!args[0]) return message.reply(new discord.MessageEmbed({description: `> the value \`string MESSAGE\` was not specified.`, color: 'RED'}))
        //check if the user is the bot or the owner
        if (message.author.id == client.user.id) return message.reply(new discord.MessageEmbed({description: `> you cannot announce yourself.`, color: 'RED'}))
        //send a message to all client.users.cache with the message content other than the command
        message.channel.send(new discord.MessageEmbed({description: `> the message  has been sent to all members.\n__**Preview**__\n\n${args.join(" ")}`, color: 'BLUE'}))
        client.users.cache.forEach(user => {
            //if the user is a bot or the author, skip them
            if (user.bot || user.id == message.author.id) return
            //send the message to the user
            try {
            user.send(new discord.MessageEmbed({description: `> Announcement from the developers (\`FarewellNehir\`)\n${args.join(" ")}`, color: 'BLUE', timestamp: new Date(),type: 'rich'}))
            } catch (err) {
            console.log("Attempted to message someone but failed, probably because they have DMs disabled.")
            }
        }
        )
    }
}
