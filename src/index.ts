import Discord from 'discord.js';
import Router from './services/route';
import Express from 'express';
import http from 'http';

function startWeb() {
    setTimeout(() => {
        const app = Express();
        app.get("/", (_req, res,) => {
            res.json(["All is well."]);
        });
        app.listen(process.env.PORT ?? 5000, () => {
            console.log(`Server running on port ${process.env.PORT ?? 5000}`);
        });
        setInterval(() => {
            callMyself();
        }, 1200000)
    }, 2000);
}

function startBot() {

    const client = new Discord.Client();
    const prefix = '!'

    const router = new Router()

    client.on('message', message => {
        if (!message.content.startsWith(prefix) || message.author.bot) return;
        const args = message.content.slice(prefix.length).split(/ +/);
        router.route(args, message)
    })

    client.once('ready', () => {
        console.log('Bot online')
    })

    client.on('error', err => {
        console.log(err)
        setTimeout(() => {
            console.log('Re login...')
            client.login(process.env.DISCORD_TOKEN).catch((err) => console.log(err))
        }, 5000);
    })

    client.login(process.env.DISCORD_TOKEN).catch((err) => console.log(err))
}

function callMyself() {
    var str = ''
    http.get('https://meeting-orchestrator.herokuapp.com/', (res) => {
        res.on('data', (chunk) => {
            str += chunk;
        });

        res.on('end', () => {
            if (str != '["All is well."]') {
                console.log(`We are actually here!! ${str}`)
            } else {
                console.log('All is well.')
            }
        })
    });
}

startWeb();
startBot();