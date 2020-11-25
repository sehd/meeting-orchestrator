import Discord from 'discord.js';
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
        var meetings = this.guilds.get(message.guild!.id)
        if (meetings === undefined) {
            message.reply("Please connect the orchestrator");
            message.react('👎')
            return;
        }

        //meetings.first().
    }
}