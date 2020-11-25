import Discord from "discord.js";
import Meetings from "./meetings";

export default class Guilds {
    private meetings: Map<string, Meetings>

    constructor() {
        this.meetings = new Map<string, Meetings>();
    }

    add(id: string, connection: Discord.VoiceConnection) {
        this.meetings.set(id, new Meetings(connection))
        connection.on('disconnect', _ => {
            if (this.meetings.has(id)) {
                this.meetings.delete(id)
            }
        })
    }

    get(id: string): Meetings | undefined {
        if (this.meetings.has(id))
            return this.meetings.get(id);
        return undefined;
    }
}