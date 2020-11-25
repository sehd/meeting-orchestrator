import Discord, { MessageType, Util } from "discord.js";
import Meeting from "../models/meeting";

export default class Meetings {
    private meetings: Meeting[]
    private connection: Discord.VoiceConnection

    constructor(connection: Discord.VoiceConnection) {
        this.meetings = new Array<Meeting>();
        if (connection === undefined)
            throw new Error("No connection to start meeting");

        this.connection = connection;
        const dispatcher = connection.play('~/assets/dt.mp3')
        dispatcher.on("error", err => console.log(err))
    }

    add(meeting: Meeting): void {

        if (this.meetings.map(o => o.name).find(v => v === meeting.name) !== undefined)
            throw new Error(`Duplicate meeting "${meeting.name}"`);

        meeting.on('remind', this.onRemind.bind(this))
        meeting.on('due', this.onDue.bind(this))
        this.meetings.push(meeting)
    }

    first(): Meeting | undefined {
        if (this.meetings.length > 0)
            return this.meetings[0];
    }

    next(): Meeting | undefined {
        this.meetings[0].stop();
        this.meetings = this.meetings.slice(1);
        return this.first();
    }

    playCountdown(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                const dispatcher = this.connection.play('assets/countdown.mp3')
                dispatcher.on("finish", () => resolve())
                dispatcher.on("error", (err) => reject(err))
            } catch (error) {
                console.log(`Couldn't play sound ${error}`)
            }
        })
    }

    private onRemind(meeting: Meeting): void {
        try {
            this.connection.play(`assets/${meeting.reminderRingtone}.mp3`)
        } catch (error) {
            console.log(`Couldn't play sound ${error}`)
        }
    }

    private onDue(meeting: Meeting): void {
        try {
            this.connection.play(`assets/${meeting.ringtone}.mp3`)
        } catch (error) {
            console.log(`Couldn't play sound ${error}`)
        }
    }
}