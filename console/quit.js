module.exports = {
    info: "quits the process.",
    async run (client, args, {options = "", commandsList = new Map()}) {
        const chalk = require('chalk')
       console.log(`${chalk.bold.magenta('-')} ${chalk.bold.red('»')} ${chalk.bold.green('Quitting...')}`)
       setTimeout(() => {
        client.destroy()
    }, 1000);
    }
}