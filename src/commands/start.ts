import Discord from 'discord.js';
import { BaseCommand } from './base_command'

export class StartCommand extends BaseCommand {

    name = 'start';
    description = 'join voice channel and start the meeting';

    execute(message: Discord.Message, args: Array<string>): void {

        if (!message!.member!.voice.channel) {
            message.channel.send("You must be in a voice channel");
            return;
        }
        if (!message.guild?.voice?.connection) {
            message!.member!.voice.channel.join().then(connection => {
                this.play(connection, message)
            })
        }
    }

    play(connection: Discord.VoiceConnection, message: Discord.Message): void {
        var dispatcher = connection.play('assets/buzzer.mp3')
    }
}
