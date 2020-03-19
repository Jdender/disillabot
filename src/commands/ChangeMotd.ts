import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { User } from 'discord.js';

export class ChangeMotd extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'changemotd',
            aliases: ['updatemotd'],
            group: 'general',
            memberName: 'changemotd',
            description: 'Change the current motd',
            guildOnly: true,
            clientPermissions: [
                'SEND_MESSAGES',
                'ADD_REACTIONS',
                'MANAGE_GUILD',
            ],
            userPermissions: ['MANAGE_GUILD'],
        });
    }

    public async run(message: CommandoMessage) {
        const client = this.client;
        // Get guild motds or create the entry if it doesn't already exist
        const guildMotds =
            client.motds.get(message.guild.id) ??
            (client.motds.set(message.guild.id, {}), {});

        if (Object.keys(guildMotds).length === 0) {
            return message.channel.send(
                'No one has suggested a motd of the day yet.',
            );
        }

        let currentMotd = '';

        // Get a random motd entry and prepare a message
        const fetchNew = () => {
            const keys = Object.keys(guildMotds);
            const randomUser = client.users.cache.get(
                guildMotds[keys[(keys.length * Math.random()) << 0]] ?? '',
            );
            currentMotd = guildMotds[randomUser?.id ?? ''] ?? '';
            return `(Submited by: ${randomUser?.tag}) "${currentMotd}"`;
        };

        // The display message and the reaction collector
        const display = await message.channel.send(fetchNew());
        const collector = display.createReactionCollector(
            (_, user: User) => user.id === message.author.id,
            {
                idle: 10 * 1000,
            },
        );

        const cases: Record<string, undefined | (() => void)> = {
            ['🔄']() {
                message.edit(fetchNew());
            },
            async ['✅']() {
                const oldName = /^(?'title'.*?)(\(".*"\))?$/.exec(
                    message.guild.name,
                )?.[1];
                if (!oldName)
                    throw new Error("Regex parsing failed (it shouldn't)");

                await message.guild.edit({
                    name: `${oldName} ("${currentMotd}")`,
                });
                collector.stop();
            },
        };

        await Promise.all(Object.keys(cases).map(message.react));

        collector.on('collect', reaction => {
            cases[reaction.emoji.name]?.();
            reaction.remove();
        });

        await new Promise(res => collector.on('end', res));

        return display;
    }
}
