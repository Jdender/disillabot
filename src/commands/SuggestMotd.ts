import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';

export class SuggestMotd extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'suggestmotd',
            group: 'general',
            memberName: 'suggestmotd',
            description: 'Suggest a MOTD for the current guild',
            guildOnly: true,
            clientPermissions: ['SEND_MESSAGES'],
            args: [
                {
                    key: 'newMotd',
                    prompt: 'What text would you like to submit as a MOTD?',
                    type: 'string',
                },
            ],
        });
    }

    public async run(
        message: CommandoMessage,
        { newMotd }: { newMotd: string },
    ) {
        // Get guild motds or create the entry if it doesn't already exist
        const guildMotds =
            this.client.motds.get(message.guild.id) ??
            (this.client.motds.set(message.guild.id, {}), {});

        // Used later
        const previous = guildMotds[message.author.id];

        // Update database
        guildMotds[message.author.id] = newMotd;
        this.client.motds.set(message.guild.id, guildMotds);

        // Confim
        return message.channel.send(
            previous
                ? `All set, I updated your suggestion. (it was "${previous}")`
                : 'All set, I submited your new suggestion.',
        );
    }
}
