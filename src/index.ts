import { CommandoClient } from 'discord.js-commando';
import { config } from './config';

const client = new CommandoClient({
    disableMentions: 'all',
    commandPrefix: config.prefix,
    invite: config.supportInvite,
    owner: config.owners,
});

//#region Registry
import { SuggestMotd } from './commands/SuggestMotd';
import { RoleMe } from './commands/RoleMe';
import { ActualMembers } from './commands/ActualMembers';
import { ChangeMotd } from './commands/ChangeMotd';

client.registry
    .registerDefaultTypes()
    .registerGroups([['general', 'The major commands of this bot']])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommands([SuggestMotd, RoleMe, ActualMembers, ChangeMotd]);
//#endregion

//#region Client Extentions
import Enmap from 'enmap';

declare module 'discord.js' {
    interface Client {
        // Guild : (User : MOTD)
        motds: Enmap<string, Record<string, string | undefined>>;
    }
}

client.motds = new Enmap({ name: 'motds' });
//#endregion

//#region Events
client.once('ready', () => {
    console.log(`Logged in as ${client.user?.tag}! (${client.user?.id})`);
});

client.on('guildMemberAdd', member => {
    const joinRoles = config.guilds[member.guild.id]?.joinRoles;
    if (!joinRoles) return;
    member.roles.add(joinRoles);
});
//#endregion

// Change this to webhook based logging at some point
client.on('error', console.error);
process.on('uncaughtException', console.error);
process.on('unhandledRejection', console.error);

client.login(config.token);
