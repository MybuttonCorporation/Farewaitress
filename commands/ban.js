//import discord and create a ban command
const discord = require('discord.js');
module.exports = {
    name: "ban",
    requests: "BAN_MEMBERS",
    info: "bans a user from the server",
    version: ["dev"],
    async run (client, message, args, serverDatabase = null) {
    //check if there was no mentions in the message and if so notify the user
    //check if there were no mentions
    //check if the first arguement is to see a reason someone was banned for
    if (args[0] == "inspect") {
        //check if the args[1] value is a valid user id
        if (!args[1]) return message.reply(new discord.MessageEmbed({description: `> the value \`string userID\` was not specified.`, color: 'RED'}))
        //check if the user id has non-numerals
        if (!/^[0-9]+$/.test(args[1])) return message.reply(new discord.MessageEmbed({description: `> the value \`string userID\` is not a valid user id.`, color: 'RED'}))
        //check if the user id is in the bans array
        if (!serverDatabase.arrayHasValue("bans", args[1])) return message.reply(new discord.MessageEmbed({description: `> the user \`${client.users.cache.get(args[1]).username}\` is not banned.`, color: 'RED'}))
        //set the value of the ban reason and the issuer of the ban to the value of constant ban reason and constant issuer
        const banReason = serverDatabase.get("banreasons." + args[1]).reason;
        const Username = serverDatabase.get("banreasons." + args[1]).name;
        const issuer = serverDatabase.get("banreasons." + args[1]).issuer;
        //send the embed with the ban reason and issuer
        message.channel.send(new discord.MessageEmbed({
            description: `
            > **User Information**
            __User Name__: \`${Username}\`
            __Banned For__: \`${banReason}\`
            __Banned By__: \`${issuer}\`
            `, color: 'BLUE'
        }))
        return;
    }

    if (!message.mentions.users.size) {
        message.channel.send(new discord.MessageEmbed({description: `The value of \`peasant USER\` is undefined\n\`${serverDatabase.get("prefix")}ban help\` for help`, color: 'RED'}));
        return;
    }
    //check if the user is trying to ban the bot or themselves
    if (message.mentions.users.first().id == client.user.id) {
        message.channel.send(new discord.MessageEmbed({description: `> You cannot ban the bot.`, color: 'RED'}));
        return;
    }
    //check if the user is trying to ban themselves
    if (message.mentions.users.first().id == message.author.id) {
        message.channel.send(new discord.MessageEmbed({description: `> You cannot ban yourself.`, color: 'RED'}));
        return;
    }
    //check if the user is trying to ban a user that is already banned
    if (serverDatabase.get("bans").includes(message.mentions.users.first().id)) {
        message.channel.send(new discord.MessageEmbed({description: `> \`${message.mentions.users.first().username}\` is already banned.`, color: 'RED'}));
        return;
    }
    //check if the user specified a reason, and if not set the reason variable to "unspecified"
    var reason = "unspecified";
    if (!args[1]) {
        var reason = "unspecified";
    } else {
        var reason = args.slice(1).join(" ");
    }
    //send a message to the user, and ban them



    //check if the bot can ban the user
    if (!message.guild.me.hasPermission("BAN_MEMBERS")) {
        message.channel.send(new discord.MessageEmbed({description: `> Farewaitress does not have the \`BAN_MEMBERS\` permission.`, color: 'RED'}));
        return;
    }
    //check if the user's role is higher than the bot's highest role
    if (message.mentions.members.first().roles.highest.position >= message.guild.me.roles.highest.position) {
        message.channel.send(new discord.MessageEmbed({description: `> \`${message.mentions.users.first().username}\` has a higher role than the bot.`, color: 'RED'}));
        return;
    }
    //check if the user's role is equal to the bot's highest role
    if (message.mentions.members.first().roles.highest.position == message.guild.me.roles.highest.position) {
        message.channel.send(new discord.MessageEmbed({description: `> \`${message.mentions.users.first().username}\`'s permissions are equal to the bot.`, color: 'RED'}));
        return;
    }
    //check if the user that is being banned is not in the server
    if (!message.guild.members.cache.has(message.mentions.users.first().id)) {
        message.channel.send(new discord.MessageEmbed({description: `> \`${message.mentions.users.first().username}\` is not in the server.`, color: 'RED'}));
        return;
    }
    message.channel.send(new discord.MessageEmbed({description: `> \`${message.mentions.users.first().username}\` has been banned.`, color: 'BLUE'}));
    message.mentions.users.first().send(new discord.MessageEmbed({description: `> You have been banned from \`${message.guild.name}\`.\n__Issued by__: \`${message.author.username}\`\n__Reason__:\`${reason}\``, color: 'RED'})).catch(()=> {
        console.log("Tried to message someone but failed, probably because they have DMs disabled.");
    })
    //add the user to the banned list,
    if (!serverDatabase.has("bans")) serverDatabase.set("bans", []);
    serverDatabase.push("bans", message.mentions.users.first().id);
    serverDatabase.set("banreasons." + message.mentions.users.first().id, {reason: reason, issuer: message.author.username, name: message.mentions.users.first().username});
    //ban the user
    try {
    message.guild.members.ban(message.mentions.users.first().id, {reason: reason});
    } 
    catch (err) {
        message.channel.send(new discord.MessageEmbed({description: `> Farewaitress was unable to ban this member because an unexpected error occured.\n\n**Error**: \`${err.name}\``, color: 'RED'}));
        return;
    }
}
}