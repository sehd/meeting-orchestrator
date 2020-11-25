import Discord from "discord.js";
import Meeting from "../models/meeting";

export default class Meetings {
    private meetings: Meeting[]
    private connection: Discord.VoiceConnection

    constructor(connection: Discord.VoiceConnection) {
        this.meetings = new Array<Meeting>();
        this.connection = connection;
        connection.play('assets/dt.mp3')
    }

    add(meeting: Meeting): void {

        if (this.meetings.map(o => o.name).find(v => v === meeting.name) !== undefined)
            throw new Error(`Duplicate meeting "${meeting.name}"`);

        meeting.on('remind', this.onRemind)
        meeting.on('due', this.onDue)
        this.meetings.push(meeting)
    }

    private onRemind(meeting: Meeting): void {
        this.connection.play(`assets/${meeting.reminderRingtone}.mp3`)
    }

    private onDue(meeting: Meeting): void {
        this.connection.play(`assets/${meeting.ringtone}.mp3`)
    }
}