import { Config } from './configtype';

export const config: Config = {
    token: 'discordBotToken',
    prefix: '',
    owners: ['userId'],
    supportInvite: 'invite',
    guilds: {
        guildId: {
            joinRoles: ['roleId'],
            adminRoles: ['roleId'],
            selfRoles: {
                roleName: 'roleId',
            },
        },
    },
};
