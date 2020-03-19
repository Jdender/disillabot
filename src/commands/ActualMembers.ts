import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { config } from '../config';

export class ActualMembers extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'actualmembers',
            aliases: ['members'],
            group: 'general',
            memberName: 'actualmembers',
            description:
                'See how many members there are as well as their types',
            guildOnly: true,
            clientPermissions: ['SEND_MESSAGES'],
        });
    }

    public async run(message: CommandoMessage) {
        // Any members that have a admin role
        const admins = message.guild.members.cache.filter(
            m =>
                config.guilds[message.guild.id]?.adminRoles?.some(r =>
                    m.roles.cache.has(r),
                ) ?? false,
        );
        // Any bots/webhooks
        const bots = message.guild.members.cache.filter(m => m.user.bot);

        return message.channel.send([
            `**There are ${message.guild.memberCount} total members in this server. Here's the breakdown:**`,
            ` • ${admins.size} admin(s)`,
            ` • ${bots.size} bot(s)`,
            ` • ${message.guild.memberCount -
                admins.size -
                bots.size} normal member(s)`,
        ]);
    }
}
