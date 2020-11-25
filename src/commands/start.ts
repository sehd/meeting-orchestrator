import Discord from 'discord.js';
import { start } from 'repl';
import Meeting from '../models/meeting';
import Guilds from '../services/guilds';
import BaseCommand from './base_command'

export default class StartCommand extends BaseCommand {

    name = 'start';
    description = 'Start the meetings';

    private guilds: Guilds

    constructor(guilds: Guilds) {
        super();
        this.guilds = guilds;
    }

    async execute(message: Discord.Message, args: Array<string>): Promise<void> {
        const meetings = this.guilds.get(message.guild!.id)
        if (meetings === undefined) {
            message.reply("Please connect the orchestrator");
            message.react('👎')
            return;
        }

        var meeting = meetings.first()
        if (meeting === undefined) {
            message.reply('No meeting session to start.')
            message.react('😕')
            return;
        }

        await meetings.playCountdown();

        while (meeting !== undefined) {
            await this.runMeeting(meeting, message);
            meeting = meetings.next();
        }
        const final = await message.channel.send('All sessions are done.');
        final.react('🥳');
    }

    private async runMeeting(meeting: Meeting, message: Discord.Message): Promise<void> {
        meeting.start();
        const startTime = Date.now();
        const bot_message = await message.channel.send(`${meeting.name} started at ${new Date(startTime).toTimeString().slice(0, 8)}`)
        const collected = await bot_message.awaitReactions(_ => true, { max: 1 });
        const duration = Date.now() - startTime;
        const users = await collected.first()?.users.fetch({ limit: 1 });
        bot_message.channel.send(`${users?.first()?.username} done this in ${this.durationToTimeString(duration)}`)
    }

    private durationToTimeString(duration: number): string {
        const total_sec = Math.round(duration / 1000);
        const sec = (total_sec % 60).toString();
        const total_min = Math.floor(total_sec / 60);
        const min = (total_min % 60).toString();
        const hour = (Math.floor(total_min / 60)).toString();
        return `${hour.padStart(2, "0")}:${min.padStart(2, "0")}:${sec.padStart(2, "0")}`
    }
}