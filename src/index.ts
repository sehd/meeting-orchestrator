import Discord from 'discord.js';
import Router from './services/route';
import config from './config.json'

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