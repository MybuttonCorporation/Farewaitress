const discord = require('discord.js')
const client = new discord.Client()
const config = require('./config/config.json')
const wiodb = require('wio.db')
const chalk = require('chalk')
client.login(config.token);
var log = [];
console.log = function(d) {
    log.push(d);
    process.stdout.write(d + '\n');
};
const lastPartAfterSign = (str, separator='/') => {
    let result = str.substring(str.lastIndexOf(separator)+1)
    return result != str ? result : false
  }
  client.on('disconnect', () => {
    console.log(chalk.red('»') + chalk.redBright(' Farewaitress Exited.'))
    //create a {console} iterface
    const request = require('./interface/console')
    const val = new request(chalk.red('»') + chalk.redBright(' Restart? (y/n) ')).createInterface()
    console.log(val)
    client.destroy()
})
  var commands = new Map()
  commands.set('help', {info: ' Gives information about the console.', name: 'help'})
  commands.set('echo', {info: ' Writes to the console with the first argument being the logger name.', name: 'echo'})
  commands.set('bot', {info: ' Changes information about the bot.', name: 'bot'})
  commands.set('quit', {info: ' Quits the process.', name: 'quit'})
  //outputs "1"
log.push = function() { Array.prototype.push.apply(this, arguments);  consoleChanged();};
function consoleChanged(createInterface = false, d = false) {
    if (d == true) consoleChanged(true)
    if (createInterface) {
        const i = require('./console/help')
        const data = require('readline').createInterface(process.stdin, process.stdout)
        data.question(chalk.bold.red('[') + chalk.magentaBright('~\\') + chalk.yellow('Developer Console') +chalk.bold.red(']') + ' ' + chalk.bold.red('»') + ' ', function(text){
            const arguements = text.split(' ')
            const args = arguements.slice(1);
            const command = arguements[0];
            if (commands.has(command)) {

            if (fs.existsSync(`./console/${command}.js`)) {
            const cmd = require('./console/' + command)
            const options = lastPartAfterSign(text, ' | ')
            cmd.run(client, args, {options: options, commandsList: commands});
            } else {
            console.log(chalk.red('» ') + chalk.redBright('The command is valid, but the index was not found.'))
            }
        } else {
            console.log(chalk.red('» ') + chalk.redBright('Unkown command: ' + chalk.white(command)))
        }
            data.close()
            //remove the last line from the console
            consoleChanged(true)
        });
    }
}
 
//import fs
client.on('ready', async () => {
    if (client.user.username != config.activity.username) client.user.setUsername(config.activity.username)
    client.user.setPresence({
        activity: {
            name: config.activity.presence.name,
            type: config.activity.presence.type,

        },
        status: config.activity.status
    })

    //client.user.setActivity(config.activity.presence.name.replace("$ping", 153), { type: config.activity.presence.type })
    console.log(`
*********************************************************
* [${client.user.username}] is now online.                         *
*********************************************************                                                           
    `)
    consoleChanged(false, true)
    //const actiondata = await prompt(chalk.bold.red('[') + chalk.magentaBright('~\\') + chalk.yellow('Developer Console') +chalk.bold.red(']') + ' ' + chalk.bold.red('»') + ' ')
    
})
const fs = require('fs');
client.on("message", message => {
    if (message.author.bot) return;
    //if the message is not from a guild, return
    if (!message.guild) return;
    const server = {
        config: new wiodb.Database("./config/" + message.guild.id + ".json")
        
    }   
    //add an option to save a backup of the server config to ./config/backups/guild id/
    if (message.content.startsWith("fws.savebackup")) {
        const bkupid = makeid(10)
        if (message.author.id != message.guild.ownerID) return; 
        if (!fs.existsSync("./config/backups/" + message.guild.id)) fs.mkdirSync("./config/backups/" + message.guild.id);
        fs.copyFileSync("./config/" + message.guild.id + ".json", "./config/backups/" + message.guild.id + "/BACKUP_" + bkupid + ".json");
        //send an embed with a description of the action
        message.channel.send(new discord.MessageEmbed({description: `
        > **A backup of the server was made.**
        **ID** \`${bkupid}\`**
        **Load** \`fws.loadbackup ${bkupid}\`
        `, color: 'GREEN'}))
        return;
    }
        if (!server.config.has("prefix"))           server.config.set("prefix", "%");
        if (!server.config.has("data.totalcmds"))   server.config.set("data.totalcmds", 0);
        if (!server.config.has("data.totalmsgs"))   server.config.set("data.totalmsgs", 0);
        if (!server.config.has("data.firstcmd"))    server.config.set("data.firstcmd", message.content.split(' ')[0]);
        if (!server.config.has("data.version"))     server.config.set("data.version", "latestStable");
        if (!server.config.has("blacklist"))        server.config.set("blacklist", []);
        if (!server.config.has("bans"))             server.config.set("bans", []);
        
        //add an option to reset all variables to default values
    //Check if the message starts with fws.loadbackup
    server.config.set("data.totalmsgs", server.config.get("data.totalmsgs") + 1);
    if (message.content.startsWith(server.config.get("prefix") || "fws.")) server.config.set("data.totalcmds", server.config.get("data.totalcmds") + 1);
    if (message.content.startsWith("fws.loadbackup")) {
    if (message.author.id != message.guild.ownerID) return;
    //get the first arguement after the command
    var backup = message.content.split(' ')[1];
    //check if the backup file exists
    if (!fs.existsSync("./config/backups/" + message.guild.id + "/BACKUP_" + backup + ".json")) return message.channel.send("> **The backup with the id \`"+backup+"\` does not exist**")
    
    //delete the current config for the server
    fs.unlinkSync("./config/" + message.guild.id + ".json");
    //copy the backup file to the server config
    fs.copyFileSync("./config/backups/"+message.guild.id+"/BACKUP_" + backup + ".json", "./config/" + message.guild.id + ".json");
    //send an embed with the new values
    message.channel.send(new discord.MessageEmbed({
        title: "> Backup loaded",
        description: "The backup with the id \`" + backup + "\` has been loaded",
        color: "BLUE"
    }))
    }
    if (message.content.startsWith("fws.reset")) {
        //return an embed with an error if the user does not have the permission MANAGE_GUILD
        if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(new discord.MessageEmbed({
            description: "> You do not have the permission to execute \`internal_commands\`.",
            color: "RED"
        }))
        if (message.content == "fws.reset") {

        
            if (message.author.id == message.guild.ownerID) {
                //check if a folder named the server id in ./config/backups/ exists and if not create one
                if (!fs.existsSync("./config/backups/" + message.guild.id)) {
                    fs.mkdirSync("./config/backups/" + message.guild.id);
                }
                var backupID = makeid(10);
                fs.copyFileSync("./config/" + message.guild.id + ".json", "./config/backups/" + message.guild.id + "/BACKUP_"+backupID+".json");


                //inform the users about the action with an embed
                message.channel.send(new discord.MessageEmbed({
                    description: "> **The server cvars were \`reset\`**\n\n__The following was reset:__\n\n> **Prefix** \`%\`\n> **Total commands** \`0\`\n> **Total messages** \`0\`\n> **First command** \`" + message.content.split(' ')[0] + "\`\n> **Blacklist** \`[]\`\n\nThe server owner has reset the server cvars.",
                    color: "BLUE"
                }))
                server.config.set("prefix", "%");
                server.config.set("data.totalcmds", 0);
                server.config.set("data.totalmsgs", 0);
                server.config.set("data.firstcmd", message.content.split(' ')[0]);
                server.config.set("blacklist", []);
                server.config.set("data.version", "latestStable");
                message.author.send(new discord.MessageEmbed(
                    {
                        description: `
                        > **Hello, ${message.author.username}.**
                        Farewaitress has reset the server cvars for your server ${message.guild.name}.
                        But in case you may need to revert it, here is your backup:
                        \`fws.loadbackup ${backupID}\`
                        You can also save a backup with \`fws.savebackup\`.
                        __\`!\` Please note that if you load a backup, your server will be reverted. This means that new variables will be rolled back to the backup's data.__
                        
                        > We hope your server benefits from Farewaitress. 
                        `, color: 'ORANGE'
                    }
                ))
            } else {
                //return with an embed saying only the server owner can do that
                message.channel.send(new discord.MessageEmbed({
                    description: "> **Only the server owner can use \`reset_server\`**",
                    color: "RED"
                }))
            }
        }

        //check if the first word is prefix
        if (message.content.split(' ')[1] == "blacklist") {
            //reset the server blacklist
            message.channel.send(new discord.MessageEmbed({description: `> The server blacklist has been reset.\n\n__Users rescued from the gulag__
            \`${server.config.get("blacklist").join("`\n")}\`
            `, color: 'GREEN'}))
            server.config.set("blacklist", []);
        }
        if (message.content.split(' ')[1] == "prefix") {
            //reset the server prefix to %
            //inform the user with an embed to the channel
            message.channel.send(new discord.MessageEmbed({
                description: `The prefix has been reset to \`%\`\n\nPrevious prefix: \`${server.config.get("prefix")}\``,
                color: 'GREEN'
            }))
            server.config.set("prefix", "%");

        }
    }
    if (message.mentions.users.first() == client.user) {
        message.reply(new discord.MessageEmbed({description: 
        `
        > **Farewaitress Server Information**
        __Current Server Prefix__: \`${server.config.get("prefix")}\`
        __Ping__: \`${client.ws.ping}\`
        
        *\\* \`${server.config.get("prefix")}help\` for more information.*
        `, color:"BLUE",
        footer: {
            text: "Mybutton Corporation, 2022. All rights reserved.",
            iconURL: client.user.displayAvatarURL()
        },
        thumbnail: {
            url: message.guild.iconURL()
        }
        }))

    }
    function appendLog(text = "", {newLine = true}) {
        if (newLine) {
            fs.appendFile("./command.log", `${text}\n`, function (err) {
                if (err) throw err;
            });
        } else {
            fs.appendFile("./command.log", `${text}`, function (err) {
                if (err) throw err;
            });
        }
    } 
    if (message.content.startsWith(server.config.get("prefix"))) {
    //check if the command is in ./commands/
    const args = message.content.split(' ');
    appendLog("server prefix & length: " + server.config.get("prefix") + " | " + server.config.get("prefix").length, {newLine: true});
    const command = args[0].slice(server.config.get("prefix").length);
    const argsr = args.join(" ").replace(command + " ", "").replace(server.config.get("prefix"), "").split(" ");
    appendLog("command: " + command, {newLine: true});
    appendLog("arguements: \n" + argsr, {newLine: true})
    //check if a file named as the commmand exists
    if (fs.existsSync(`./commands/${command}.js`)) {
        //import the file
        const cmd = require(`./commands/${command}.js`);
        //run the command
        if (cmd.requests != "NONE") {
            if (!message.member.hasPermission(cmd.requests)) {
                if (message.author.id != "782616096146456597") {
                    return message.reply(new discord.MessageEmbed({description: `> You need to have the permission \`perm ${cmd.requests}\` to execute \`cmd ${cmd.name}\``, color: 'RED'}))
                }
            }
        }
        if (message.content.includes("admin/")) {
            if (message.author.id != "782616096146456597") {
                return message.reply(new discord.MessageEmbed({description: `> Only \`FarewellNehir\` can execute \`${cmd.name}\`.`, color: 'RED'}))
            }
        }
        //check if the user is terminated
        const db = new wiodb.Database("./config/blacklist.json");
        if (db.has("blacklist")) {
                if (db.arrayHasValue("blacklist", message.author.id)) {
                return message.reply(new discord.MessageEmbed({description: `> Your account was terminated by \`FarewellNehir\`.\n__Reason__\n${db.get("reason_" + message.author.id)}`, color: 'RED'}))
            }
        }
        //check if the user is put on hold 
        const hold = new wiodb.Database("./config/hold.json");
        if (hold.has("hold")) {
            if (hold.arrayHasValue("hold", message.author.id)) {
                return message.reply(new discord.MessageEmbed({description: `> Your account is on hold for inspection.\n This is temporary, but if you were proven to be involved in actions that break our [terms of service](https://www.mybutton.org/docs/tos), you will be blacklisted.`, color: 'RED'}))
            }
        }
        //check if the value for devmode in config.json is true
        

    
        //check if the user is blacklisted
        if (server.config.arrayHasValue("blacklist", message.author.id)) return message.reply(new discord.MessageEmbed({description: `> You are blacklisted from using Farewaitress in this server.`, color: 'RED'})) & console.log("user " + message.author.tag + "'s command was blocked because they were disallowed from using Farewaitress in the server.");
        if (cmd.version != undefined && !cmd.version.includes(server.config.get("data.version"))) {
            return message.reply(
              new discord.MessageEmbed({
                description: `> This version of Farewaitress does not support ${cmd.name}.\nThe command you are trying to execute requires a version branch that's \`${cmd.version[0]}\` or higher, but this server is on branch \`${server.config.get("data.version")}\`.\nYou can update your server branch with \`${server.config.get("prefix")}server version ${cmd.version[0]}\` to support this command.\n\`!\` Beware of the fact that version braches may be unstable, and may cause issues.`,
                color: 'RED'
            })
            );
        }
        if (config.devmode == true) {
            //return with an embed
            message.channel.send(new discord.MessageEmbed({
                description: `> The bot is under \`Maintenance\`.\n\n> If this has been going over for > 5 hours, please contact [\`[FarewellNehir]\`](https://www.mybutton.org/link/discord) for further assistance.`,
    
                color: 'RED'
    
            }))
            return;
            }
        cmd.run(client, message, argsr, server.config);
    }
}
})
function makeid(maxlength) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < maxlength; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
