import Discord from 'discord.js';
import Guilds from '../services/guilds';
import BaseCommand from './base_command'

export default class StartCommand extends BaseCommand {

    name = 'start';
    description = 'join voice channel and start the meeting';

    private guilds: Guilds

    constructor(guilds: Guilds) {
        super();
        this.guilds = guilds;
    }

    execute(message: Discord.Message, args: Array<string>): void {

        if (!message!.member!.voice.channel) {
            message.channel.send("You must be in a voice channel");
            return;
        }
        if (!message.guild?.voice?.connection) {
            message!.member!.voice.channel.join().then(connection =>
                this.guilds.add(message.guild!.id, connection)
            )
        }
    }
}
