import Discord from 'discord.js';
import BaseCommand from '../commands/base_command';
import StartCommand from '../commands/start'

export default class Router {
    private commands: Map<string, BaseCommand>
    constructor() {
        this.commands = new Map<string, BaseCommand>();
        this.commands.set('start', new StartCommand());
    }

    route(args: Array<string>, message: Discord.Message): void {
        if (args === null || args === undefined || args.length < 1) {
            return;
        }
        const command = args!.shift()!.toLowerCase();

        if (this.commands.has(command)) {
            this.commands.get(command)?.execute(message, args)
        }
    }
}