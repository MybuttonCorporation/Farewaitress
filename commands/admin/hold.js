const discord = require('discord.js')
module.exports = {
    name: "hold",
    info: "Puts the account of a user on hold temporarily for inspection.",
    requests: "OWNER",
    async run (client, message, args, serverDatabase = null) {
        //check if the message tagged anyone, if not notify
        if (!message.mentions.users.first()) return message.reply(new discord.MessageEmbed({description: `> the value \`peasant USER\` was not specified.`, color: 'RED'}))
        //check if the user is already put on hold and if so undo it
        //check if the user is the bot or the owner
        if (message.mentions.users.first().id == message.author.id) return message.reply(new discord.MessageEmbed({description: `> you cannot put yourself on hold.`, color: 'RED'}))
        if (message.mentions.users.first().id == client.user.id) return message.reply(new discord.MessageEmbed({description: `> you cannot put the bot on hold.`, color: 'RED'}))
        const wiodb = require('wio.db')
        const Database = new wiodb.Database(`./config/hold.json`)
        //check if the database has an array called hold and if not create it
        if (!Database.has("hold")) Database.set("hold", [])
        if (Database.arrayHasValue("hold", message.mentions.users.first().id)) {
            Database.pull("hold", message.mentions.users.first().id)
            message.channel.send(new discord.MessageEmbed({description: `> the user \`${message.mentions.users.first().tag}\` has been removed from the hold list.`, color: 'BLUE'}))
            //notify the user
            try {
            message.mentions.users.first().send(new discord.MessageEmbed({description: `> Your account is no longer in hold.\nYou were proven innocent. Thank you for cooperating and following our [guidelines & terms of service](https://www.mybutton.org/docs/tos).`, color: 'BLUE'}))
            } catch (err) {
            console.log("Attempted to message someone but failed, probably because they have DMs disabled.")
            }
        } else {
            Database.push("hold", message.mentions.users.first().id)
            message.channel.send(new discord.MessageEmbed({description: `> the user \`${message.mentions.users.first().tag}\` has been put on hold.`, color: 'BLUE'}))
            //notify the user
            try {
            message.mentions.users.first().send(new discord.MessageEmbed({description: `> Your account was put on hold by \`FarewellNehir\`.\nThis is temporary, but it means that your account is being inspected.\nIf FarewellNehir decides that you were involved in actions that break our [terms of service](https://www.mybutton.org/docs/tos), you will be blacklisted.`, color: 'RED'}))
            } catch (err) {
            console.log("Attempted to message someone but failed, probably because they have DMs disabled.")
            }
        }
    }
}