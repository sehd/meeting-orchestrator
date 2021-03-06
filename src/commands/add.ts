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

    async execute(message: Discord.Message, args: Array<string>): Promise<void> {
        const meetings = this.guilds.get(message.guild!.id)
        if (meetings === undefined) {
            message.reply("Please connect the orchestrator");
            message.react('👎')
            return;
        }

        if (args.length < 1) {
            message.reply("No parameters specified");
            message.react('👎')
            return;
        }

        var requestedMeetings = Array<Meeting | string>()
        for (const arg of args) {
            if (arg.startsWith('(')) {
                const parts = arg.split('*');
                if (parts.length != 2) {
                    requestedMeetings.push("Invalid Format");
                    continue;
                }
                const actualArg = parts[0];
                const times = parseInt(parts[1]);
                if (isNaN(times)) {
                    requestedMeetings.push("Times must be a number");
                    continue;
                }
                for (let i = 0; i < times; i++) {
                    const meeting = this.parseItem(actualArg);
                    if (typeof meeting !== "string") {
                        meeting.name += `_${(i + 1)}`;
                    }
                    requestedMeetings.push(meeting);
                }
            } else {
                const meeting = this.parseItem(arg);
                requestedMeetings.push(meeting)
            }
        }

        for (const meeting of requestedMeetings) {
            if (typeof meeting === "string") {
                message.reply(meeting)
                message.react('👎')
            }
            else {
                try {
                    meetings.add(meeting);
                    message.react('👍')
                } catch (error) {
                    if (error instanceof Error) {
                        message.reply(error.message);
                        message.react('👎')
                    }
                    else
                        message.reply("Unknown error occurred")
                    message.react('👎')
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
            reminderRingtone ?? 'ding', ringtone ?? 'seatbelt')
    }
}
