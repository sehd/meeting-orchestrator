import Discord from 'discord.js';
import Meeting from '../models/meeting';
import Guilds from '../services/guilds';
import BaseCommand from './base_command'

export default class AddCommand extends BaseCommand {

    name = 'add';
    description = 'add one or many meeting(s) to the orchestrator';

    private guilds: Guilds

    constructor(guilds: Guilds) {
        super();
        this.guilds = guilds;
    }

    execute(message: Discord.Message, args: Array<string>): void {
        var meetings = this.guilds.get(message.guild!.id)
        if (meetings === undefined) {
            message.channel.send("Please start the orchestrator");
            return;
        }

        if (args.length < 1)
            message.channel.send("No parameters specified");

        for (const arg of args) {
            const meeting = this.parseItem(arg);
            if (typeof meeting === "string")
                message.channel.send(meeting)
            else {
                try {
                    meetings.add(meeting);
                    message.channel.send(`${meeting.name} added.`)
                } catch (error) {
                    if (error instanceof Error)
                        message.channel.send(error.message);
                    else
                        message.channel.send("Unknown error occurred")
                }
            }
        }
    }

    private parseItem(spec: string): Meeting | string {
        const parts = spec.split(',')
        if (parts.length < 2)
            return "Meeting must have at least a name and duration";

        const name = parts[0];
        const duration = parseInt(parts[1]);
        if (isNaN(duration))
            return "Duration must be a number";

        var reminder: number = 0;
        var reminderRingtone: string | undefined;
        var ringtone: string | undefined;
        if (parts.length > 2) {
            reminder = parseInt(parts[2])
            if (isNaN(reminder)) {
                ringtone = parts[2];
                reminder = 0;
            }
        }
        if (parts.length > 3) {
            if (reminder === 0)
                return "Invalid format. Third part should be the reminder";
            ringtone = parts[3]
        }
        if (parts.length > 4)
            reminderRingtone = parts[4]

        return new Meeting(name, duration, reminder,
            reminderRingtone ?? 'tindeck', ringtone ?? 'horn')
    }
}
