import Discord from 'discord.js'

export default abstract class BaseCommand {
    abstract name: string
    abstract description: string
    abstract execute(message: Discord.Message, args: Array<string>): void
}