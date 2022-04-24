const discord = require('discord.js') 
module.exports = {
    name: "devmode",
    info: "Disables all communications with clients other than the administrator and the developer.",
    requests: "OWNER",
    version: ["beta", "dev", "latest"],
    async run (client, message, args, serverDatabase = null) {
        const db = require('wio.db').Database;
        const Database = new db("config/config.json");
        var state = false; 
        if (!Database.has("devmode")) Database.set("devmode", true); state = Database.get("devmode");
        Database.set("devmode", state);
        if (state) return message.reply(new discord.MessageEmbed({description: `> Maintenance mode \`enabled\`.`, color: 'red'}))
        else return message.reply(new discord.MessageEmbed({description: `> Maintenance mode \`disabled\`.`, color: 'green'}))
    }
}
