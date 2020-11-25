import Discord from 'discord.js';
import Router from './services/route';
import Express from 'express'

//Start web
setTimeout(() => {
    const app = Express();
    app.get("/", (_req, res,) => {
        res.json(["All is well."]);
    });
    app.listen(process.env.PORT ?? 5000, () => {
        console.log(`Server running on port ${process.env.PORT ?? 5000}`);
    });
}, 2000);

//Start bot

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

client.login(process.env.DISCORD_TOKEN)