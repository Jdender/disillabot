import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { config } from '../config';

export class RoleMe extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'roleme',
            aliases: ['canhas'],
            group: 'general',
            memberName: 'roleme',
            description: 'Asign your self a role',
            clientPermissions: ['MANAGE_ROLES', 'SEND_MESSAGES'],
            args: [
                {
                    key: 'rolemeName',
                    prompt:
                        'What role would you like? (say "list" to see options)',
                    type: 'string',
                    default: '',
                },
            ],
        });
    }

    public async run(
        message: CommandoMessage,
        { rolemeName }: { rolemeName: string },
    ) {
        const selfRoles = config.guilds[message.guild.id]?.selfRoles;

        // List options
        if (!rolemeName || rolemeName === 'list') {
            return message.channel.send(
                selfRoles
                    ? [
                          `Here are the current self assignable roles in this server:`,
                          ...Object.keys(selfRoles ?? {}).map(
                              key => ` • ${key}`,
                          ),
                      ]
                    : 'There are no self assignable roles setup in this server.',
            );
        }

        // Find the role
        const role = message.guild.roles.cache.get(
            selfRoles?.[rolemeName] ?? '',
        );
        if (!role) {
            return message.channel.send(
                "I couldn't find that role, are you sure that's a self role?",
            );
        }

        if (message.member.roles.cache.has(role.id)) {
            // If the user already has the role, remove it
            await message.member.roles.remove(
                role,
                'User used the roleme command.',
            );
            return message.channel.send(
                `All set, I removed the "${rolemeName}" role from you.`,
            );
        } else {
            // Otherwise add it
            await message.member.roles.add(
                role,
                'User used the roleme command.',
            );
            return message.channel.send(
                `All set, I gave you the "${rolemeName}" role.`,
            );
        }
    }
}
