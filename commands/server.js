const discord = require('discord.js')

module.exports = {
    name: "server",
    requests: "MANAGE_GUILD",
    info: "modifies the configuration for the server",
    async run (client, message, args, serverDatabase = null) {
        if (message.content == "%server") {
            message.channel.send(new discord.MessageEmbed({description: `The length of \`string[] args\` is 0\n\`${serverDatabase.get("prefix")}server help\` for help`, color: 'RED'}));
            return;
        }
        if (!args[0])
          return message.reply(
            new discord.MessageEmbed({
              description: `> The arguement \`string command\` was not defined.\n\`${serverDatabase.get(
                "prefix"
              )}server help\` for help`,
              color: "RED",
            })
          );



        if (args[0] == "help") {
        //reply with a message that lists all the arguements
            message.channel.send(new discord.MessageEmbed({
            description: `
            > **Available options for \`${serverDatabase.get("prefix")}server\`**

            \`${serverDatabase.get("prefix")}server prefix     <new prefix>   \` - changes the server prefix
            \`${serverDatabase.get("prefix")}server blacklist  <@User Mention>\` - adds a user to the blacklist
            \`${serverDatabase.get("prefix")}server -blacklist <@User Mention>\` - adds a user to the blacklist
            \`${serverDatabase.get("prefix")}server help                      \` - lists all the arguements
            \`${serverDatabase.get("prefix")}server info                      \` - shows information about the server
            \`${serverDatabase.get("prefix")}server version                   \` - changes the server version
            \`${serverDatabase.get("prefix")}server versions                  \` - shows all available versions
            \`${serverDatabase.get("prefix")}server version-info              \` - shows all available versions
            
            
            `,
            color: 'BLUE'
            }))
        }
        if (args[0] == "info") {
            message.channel.send(new discord.MessageEmbed({
                description: `
                > **Server information**
                **Server Prefix** - \`${serverDatabase.get("prefix")}\`
                **Total Commands Executed** - \`${serverDatabase.get("data.totalcmds")}\`
                **Total Messages Sent** - \`${serverDatabase.get("data.totalmsgs")}\`
                **FWS Version** - \`${serverDatabase.get("data.version")}\`
                > **Server Blacklist** 
                \`@Terminated Users,\n${serverDatabase.get("blacklist").map(x => `${client.users.cache.get(x).username}`).join(",\n")}\`
                `,
                color: 'BLUE'
            }))
        }
        //if the args[0] variable is versions, then reply with all the versions from ../config/config.json 
        if (args[0] == "versions") {
            const versions = require('../config/config.json').versions
            message.channel.send(new discord.MessageEmbed({
                description: `
                > **Available versions**
                \`version dev\` **Dev** \`${versions.latestdev}\` ${(serverDatabase.get("data.version") == "dev") ? "\\🗃️ " : ""}
                \`version beta\` **Beta** \`${versions.latestbeta}\` ${(serverDatabase.get("data.version") == "beta") ? "\\🗃️ " : ""}
                \`version latestStable\` **Stable** \`${versions.currentStable}\` ${(serverDatabase.get("data.version") == "latestStable") ? "\\🗃️ " : ""}
                \`version latest-depreciated\` **Last** \`${versions.depreciated}\` ${(serverDatabase.get("data.version") == "latest-depreciated") ? "\\🗃️ " : ""}

                \* the \`🗃️\` icon shows if the specified version is the server version.
                `,
                color: 'BLUE'
            }))
        }
        //list all versions if the args[0] value is version-list
        if (args[0] == "version-info") {
            const versions = require('../config/config.json').versions
            message.channel.send(new discord.MessageEmbed({
                description: `
                 **Version Information**
                ${versions.developer_versions.map(x => `> \`${x.version}\`: __${x.description}__ (\`${x.branch}\`)`).join("\n")}
                `,
                color: 'BLUE'
            }))
        }
        
        //add an option to change the server version
        
        if (args[0] == "version") {
            if (!args[1]) return message.channel.send(new discord.MessageEmbed({description: `The length of \`ver VERSION\` is 0\n\`${serverDatabase.get("prefix")}server help\` for help\n\`${serverDatabase.get("prefix")}server versions\` for a list of versions`, color: 'RED'}));
            
            if (args[1] == "dev") message.channel.send(new discord.MessageEmbed({description: `> The version channel has been set to \`dev\`.\nCurrent Latest Dev Build - \`${require('../config/config.json').versions.latestdev}\``, color: 'BLUE'}));
            else if (args[1] == "beta") message.channel.send(new discord.MessageEmbed({description: `> The version channel has been set to \`beta\`.\nCurrent Latest Beta Build - \`${require('../config/config.json').versions.latestbeta}\``, color: 'BLUE'}));
            else if (args[1] == "stable") message.channel.send(new discord.MessageEmbed({description: `> The version channel has been set to \`stable\`.\nCurrent Latest Stable Build - \`${require('../config/config.json').versions.stable}\``, color: 'BLUE'}));
            else if (args[1] == "stable") message.channel.send(new discord.MessageEmbed({description: `> The version channel has been set to \`stable\`.\nCurrent Latest Stable Build - \`${require('../config/config.json').versions.stable}\``, color: 'BLUE'}));
            else if (args[1] == "latest-depreciated") message.channel.send(new discord.MessageEmbed({description: `> The version channel has been set to \`depreciated\`.\n**! This version is no longer supported.**\nVersion: \`${require('../config/config.json').versions.depreciated}\``, color: 'ORANGE'}));
            
            else return message.reply(new discord.MessageEmbed({description: `Farewaitress does not have a version named \`${args[1]}\`.\n\`${serverDatabase.get("prefix")}server versions\` for a list of versions`, color: 'RED'}));
            serverDatabase.set("data.version", args[1]);
        }
        if (args[0] == "-blacklist") {
            if (!args[1]) return message.reply(new discord.MessageEmbed({description: `> The arguement \`peasant user\` was not defined.\nMention them with: \`${serverDatabase.get("prefix")}server blacklist @Person\``, color: 'RED'}))
            if (!serverDatabase.has("blacklist")) serverDatabase.set("blacklist", [])
            if (serverDatabase.get("blacklist").includes(args[1])) return message.reply(new discord.MessageEmbed({description: `> The user \`${args[1]}\` is already blacklisted.`, color: 'RED'}))
            const userID = args[1].replace(/[^0-9]/g, ""); //remove all non-numbers
            if (!client.users.cache.has(userID)) return message.reply(new discord.MessageEmbed({description: `> The user \`${args[1]}\` was not found.`, color: 'RED'}))
            serverDatabase.pull("blacklist", userID)
            message.reply(new discord.MessageEmbed({description: `> The user \`${client.users.cache.get(userID).username}\`'s blacklist was removed. `, color: 'GREEN'}))
        }
        if (args[0] == "blacklist") {
            if (!args[1]) return message.reply(new discord.MessageEmbed({description: `> The arguement \`peasant user\` was not defined.\nMention them with: \`${serverDatabase.get("prefix")}server blacklist @Person\``, color: 'RED'}))
            if (!serverDatabase.has("blacklist")) serverDatabase.set("blacklist", [])
            if (serverDatabase.get("blacklist").includes(args[1])) return message.reply(new discord.MessageEmbed({description: `> The user \`${args[1]}\` is already blacklisted.`, color: 'RED'}))
            const userID = args[1].replace(/[^0-9]/g, ""); //remove all non-numbers
            
            if (!client.users.cache.has(userID)) return message.reply(new discord.MessageEmbed({description: `> The user \`${args[1]}\` was not found.`, color: 'RED'}))
            serverDatabase.push("blacklist", userID)
            message.reply(new discord.MessageEmbed({description: `> The user \`${client.users.cache.get(userID).username}\` has been blacklisted.`, color: 'RED'}))
        }
        if (args[0] == "prefix") {
            if (!args[1]) return message.reply(new discord.MessageEmbed({description: `> The arguement \`string new_prefix\` was not defined.`, color: 'RED'}))
            if (serverDatabase == null) return message.reply(new discord.MessageEmbed({description: `> The server database was not specified.`, color: 'RED'}))
            const currentPrefix = serverDatabase.get("prefix");
            const replacementPx = args[1];
            const embed = new discord.MessageEmbed({
                description: `
                > **Changed Server Prefix**
                __Previous prefix__: \`${currentPrefix}\`
                __New prefix__: \`${replacementPx}\`, 

                *\\* You can always reset your prefix with fws.reset prefix* 
                `, 
                color: 'GREEN'
            })
            serverDatabase.set("prefix", replacementPx);
            message.reply(embed)
        }
        //if the arguement is not any of the above then say it to the user

    }
}