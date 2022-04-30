const discord = require('discord.js') 
module.exports = {
    name: "devmode",
    info: "Disables all communications with clients other than the administrator and the developer.",
    requests: "OWNER",
    version: ["beta", "dev", "latest"],
    async run (client, message, args, serverDatabase = null) {
        const db = require('wio.db').Database;
        const Database = new db("config/config.json");
        if (!Database.has("devmode")) {
            Database.set("devmode", true);
            message.channel.send(new discord.MessageEmbed({description: `> Maintenance mode \`enabled\`.`, color: 'RED'}))
            return
        }
        if (Database.get("devmode") == false) {
            Database.set("devmode", true)
            message.channel.send(new discord.MessageEmbed({description: `> Maintenance mode \`enabled\`.`, color: 'RED'}))
        }
        if (Database.get("devmode") == true) {
            
            message.channel.send(new discord.MessageEmbed({description: `> Maintenance mode \`disabled\`.`, color: 'GREEN'}))
            Database.set("devmode", false)
        }
}
}
