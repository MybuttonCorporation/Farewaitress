const discord = require('discord.js')

module.exports = {
    name: 'leave',
    info: 'Leaves the voice channel',
    version: ['beta', 'dev'],
    requests: 'NONE',
    async run (client, message, args, serverDatabase = null) {
        //if the bott isnt in a vc return with an embed
        if (!message.guild.me.voice.channel) return message.reply(new discord.MessageEmbed({description: `> The bot must be in a voice channel to use this command.`, color: 'RED'}))
        //if the user isnt in a voice channel return with an embed
        if (!message.member.voice.channel) return message.reply(new discord.MessageEmbed({description: `> you must be in a voice channel to use this command.`, color: 'RED'}))
        //if the user's voice channel isn't the bot's voice channel return with an embed
        if (message.member.voice.channel.id != message.guild.me.voice.channel.id) return message.reply(new discord.MessageEmbed({description: `> you must be in the same voice channel as the bot to use this command.`, color: 'RED'}))
        
        message.member.voice.channel.leave();
        message.channel.send(new discord.MessageEmbed({description: `> Ok left vc`, color: 'RED'}))
    }
}