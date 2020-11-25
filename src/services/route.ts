import Discord from 'discord.js';
import AddCommand from '../commands/add';
import BaseCommand from '../commands/base_command';
import StartCommand from '../commands/start';
import ConnectCommand from '../commands/connect'
import Guilds from './guilds';

export default class Router {
    private commands = new Map<string, BaseCommand>();
    private guilds = new Guilds()

    async route(args: Array<string>, message: Discord.Message): Promise<void> {
        if (args === null || args === undefined || args.length < 1) {
            return;
        }
        const command = args!.shift()!.toLowerCase();

        var meetings = this.guilds.get(message.guild!.id)
        if (meetings === undefined && command != 'connect') {
            await this.getCommand('connect')?.execute(message, args)
        }

        this.getCommand(command)?.execute(message, args)
    }

    private getCommand(command: string): BaseCommand | undefined {
        if (this.commands.has(command))
            return this.commands.get(command);

        switch (command) {
            case 'connect':
                const con = new ConnectCommand(this.guilds);
                this.commands.set('connect', con);
                return con;
            case 'add':
                const add = new AddCommand(this.guilds);
                this.commands.set('connect', add);
                return add;
            case 'start':
                const start = new StartCommand(this.guilds);
                this.commands.set('connect', start);
                return start;
            default:
                console.log(`Unknown command ${command}`)
                return undefined;
        }
    }
}