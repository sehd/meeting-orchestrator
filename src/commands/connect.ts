import Discord from 'discord.js';
import Guilds from '../services/guilds';
import BaseCommand from './base_command'

export default class ConnectCommand extends BaseCommand {

    name = 'connect';
    description = 'join voice channel and start the meeting';

    private guilds: Guilds

    constructor(guilds: Guilds) {
        super();
        this.guilds = guilds;
    }

    async execute(message: Discord.Message, args: Array<string>): Promise<void> {

        if (!message!.member!.voice.channel) {
            message.channel.send("You must be in a voice channel");
            return;
        }
        if (!message.guild?.voice?.connection) {
            const connection = await message!.member!.voice.channel.join();
            this.guilds.add(message.guild!.id, connection);
        }
    }
}
