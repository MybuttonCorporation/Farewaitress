const discord = require('discord.js')

module.exports = {
    name: 'play',
    info: 'Plays a song from youtube',
    version: ['beta', 'dev'],
    requests: 'NONE',
    async run (client, message, args, serverDatabase = null) {
        //if the user isnt in a voice channel return with an embed
        if (!message.member.voice.channel) return message.reply(new discord.MessageEmbed({description: `> you must be in a voice channel to use this command.`, color: 'RED'}))
    //check if the message arguements is less than 1
        if (!args[0]) {
            message.channel.send(new discord.MessageEmbed({description: `> the value \`string name\` was not specified.`, color: 'RED'}))
           return;
        }
        //search with yt-search
        const search = require('yt-search');
        //loop through the array of args
        var loop = false;
        var songName = "";
        for (let i = 0; i < args.length; i++) {
            //if the arg is loop:true, set the loop to true
            if (args[i] == '#loop:true') {
                loop = true;
            }
            else if (args[i] == '<loop:true>') {
                loop = true;
            }
            else if (args[i] == '{loop:true}') {
                loop = true;
            }
            else if (args[i] == '$loop:true') {
                loop = true;
            }
            else songName += args[i] + ' ';
        }
        search(songName, async function(err, res) {
            if (err) return console.log(err);
            //validate the link with ytdl-core
            const ytdl = require('ytdl-core');
            if (ytdl.validateURL(res.videos[0].url)) {
                var msg_first = null
                message.channel.send(new discord.MessageEmbed({description: `> Searching for \`${songName}\`...`, color: 'BLUE'}))
                .then(m=>msg_first=m)
                async function playSong() {
                                 //play the song
                const connection = await message.member.voice.channel.join();
                const dispatcher = await connection.play(ytdl(res.videos[0].url, {filter: 'audioonly', highWaterMark: 1 << 25, quality: "highestaudio"}));
                var msg = null;
                
                if (msg_first != null) msg_first.edit(new discord.MessageEmbed({
                    author: {
                        name: '> ' + res.videos[0].title,
                        url: res.videos[0].url,
                        iconURL: res.videos[0].thumbnail
                         
                    },
                    description: `
                
                \\* *Note: You can use \`{loop:true}, #loop:true, <loop:true> or $loop:true\` while defining the song name and it will set loop to \`true\`.*
                `, color: 'BLUE', image: {url: res.videos[0].thumbnail}}).addField('> Length', `\`[${res.videos[0].timestamp}]\``, true).addField('> Views', `\`[${res.videos[0].views}]\``, true).addField('> Author', `[\`[${res.videos[0].author.name}]\`](${res.videos[0].author.url})`, true).setFooter('loop: ' + loop, res.videos[0].image)).then(m => msg = m)
                else if (msg_first == null) message.channel.send(new discord.MessageEmbed({
                    author: {
                        name: '> ' + res.videos[0].title,
                        url: res.videos[0].url,
                        iconURL: res.videos[0].thumbnail
                         
                    },
                    description: `
                
                \\* *Note: You can use \`{loop:true}, #loop:true, <loop:true> or $loop:true\` while defining the song name and it will set loop to \`true\`.*
                `, color: 'BLUE', image: {url: res.videos[0].thumbnail}}).addField('> Length', `\`[${res.videos[0].timestamp}]\``, true).addField('> Views', `\`[${res.videos[0].views}]\``, true).addField('> Author', `[\`[${res.videos[0].author.name}]\`](${res.videos[0].author.url})`, true).setFooter('loop: ' + loop, res.videos[0].image)).then(m => msg = m)
                
                dispatcher.on('finish', () => {
                    if (msg != null)    msg.edit(new discord.MessageEmbed({description: `Finished playing: \`${res.videos[0].title}\``, color: 'RED'}))
                    else message.channel.send(new discord.MessageEmbed({description: `Finished playing: \`${res.videos[0].title}\``, color: 'RED'}))
                    if (loop && msg != null) return playSong(); msg.edit(new discord.MessageEmbed({description: `🔁 Looping...`, color: 'YELLOW'}))
                    playSong(); msg.edit(new discord.MessageEmbed({description: `🔁 Looping...`, color: 'YELLOW'}))
                })   
                }
                playSong();

            } else {
                message.channel.send(new discord.MessageEmbed({description: `> the audio in \`string url\` is private.`, color: 'RED'}))
            }
        }
    )
    }

    
}