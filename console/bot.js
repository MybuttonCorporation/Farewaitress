const chalk = require('chalk')
module.exports = {
    info: 'Changes information about the bot',
    async run (client, args, {options = "", commandsList = new Map()}) {
    if (!args[0]) {
        console.log(`${chalk.red('»')} ${chalk.redBright(' No arguements were provided.')}`)
    return
    }
    if (args[0] == "restart") {
        const { exec } = require('child_process');
        var new_bot = exec('node ./index.js', (err, stdout, stderr) => {
          if (err) {
            // node couldn't execute the command
            console.log(`${chalk.red('»')} ${chalk.redBright(' Error:')} ${chalk.redBright(err.name)}`)
            return;
          }
        
        });
        client.destroy();
        console.clear();
        console.log(`${chalk.red('»')} ${chalk.redBright(' Restarting...')}`)
        new_bot.stdout.pipe(process.stdout);
        new_bot.stderr.pipe(process.stderr);
        
    }

    if (args[0] == "status") {
        if (!args[1]) return console.log(`${chalk.red('»')} ${chalk.green(' Status:')} ${chalk.blueBright(client.user.presence.status)}`)
        if (args[1] == "reset" || args[1] == "online") {
            client.user.setStatus("ONLINE")
        }
        else if (args[1] == "idle") {
            client.user.setStatus("IDLE")
        }
        else if (args[1] == "dnd") {
            client.user.setStatus("DND")
        }
        else if (args[1] == "invisible") {
            client.user.setStatus("INVISIBLE")
        }
        else {
            console.log(`${chalk.red('»')} ${chalk.redBright(' Invalid status.')}`)
            return
        }
        var status;
        var message;
        status = args[1];
        if (status == "idle") var message = chalk.rgb(245, 162, 20)(status)
        if (status == "online") var message = chalk.rgb(0, 255, 0)(status)
        if (status == "dnd") var message = chalk.rgb(255, 0, 0)(status)
        if (status == "invisible") var message = chalk.rgb(77, 77, 77)(status)
        console.log(`${chalk.bold.magenta('-')} ${chalk.bold.red('»')} ${chalk.bold.green('Status')}: ${status}`)
    }

    else if (args[0] == "activity") {
        //change the bot's activity name to all arguements
        if (!args[1]) return console.log(`${chalk.red('»')} ${chalk.green(' Activity:')} ${chalk.blueBright(client.user.presence.activities[0].name)}`)
        client.user.setActivity(args.slice(1).join(' '), {type: 'WATCHING'})
    }
        //restart the process
        if (args[0] == "restart") {
            console.clear();
            console.log(`${chalk.red('»')} ${chalk.redBright('lol I tried for weeks to do this it just wont work lmao\nanyways')}`)
            
        }
    }
}