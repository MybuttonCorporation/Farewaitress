const chalk = require('chalk')
module.exports = {
    info: 'Gives information about the console',
    async run (client, args, {options = "", commandsList = new Map()}) {
const commands = []
for (const [key, value] of commandsList) {
    commands.push(`${key} ${chalk.bold.magenta('-')} ${value.info}`)
}
    console.log(`
    ${chalk.green('* ') + chalk.blue('help') + chalk.green(' *')}
    ${chalk.bold.magenta('-')} Welcome to the developer console.
    ${chalk.bold.magenta('-')} This console is used to interact with the bot directly.
    ${chalk.bold.magenta('-')} To use this console, type in the command you want to use.
    
    $ Information
    ${chalk.bold.magenta('-')} ${chalk.bold.red('»')} ${chalk.bold.green('Bot Name')}: ${chalk.bold.blueBright(client.user.username)}
    ${chalk.bold.magenta('-')} ${chalk.bold.red('»')} ${chalk.bold.green('Bot ID')}: ${chalk.bold.blueBright(client.user.id)}
    ${chalk.bold.magenta('-')} ${chalk.bold.red('»')} ${chalk.bold.green('Bot Tag')}: ${chalk.bold.blueBright(client.user.tag)}
    ${chalk.bold.magenta('-')} ${chalk.bold.red('»')} ${chalk.bold.green('Bot Status')}: ${chalk.bold.blueBright(client.user.presence.status)}

    $ Commands`)
commandsList.forEach(i => {
    console.log(`    ${chalk.bold.magenta('-')} ${chalk.bold.red('»')} ${chalk.bold.green(i.name)}: ${chalk.bold.blueBright(i.info)}`)
})
  }
}
