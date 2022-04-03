const chalk = require('chalk')
module.exports = {
    info: 'Logs to the console with the first argument as the logger name',
    async run (client, args, {options = "", commandsList = new Map()}) {
        //log to the console using console.log
        if (!args[0]) {
            console.log(`${chalk.red('»')} ${chalk.redBright(' No arguements were provided.')}`)
            return;
        }
        if (!args[1]) {
            console.log(`${chalk.red('»')} ${chalk.redBright(' Message too short.\nUsage:\n   echo [logger name] [message]')}`)
            return;
        }
        console.log(`${chalk.bold.magenta('-')} ${chalk.bold.red('»')} ${chalk.bold.green(args[0])}: ${chalk.bold.blueBright(args.slice(1).join(' '))}`)

    }
}