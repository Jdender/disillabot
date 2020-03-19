import { CommandoClient } from 'discord.js-commando';
import config from './config';

const client = new CommandoClient({
    disableMentions: 'all',
    commandPrefix: config.prefix,
    invite: 'https://discord.gg/6VbJezy',
    owner: [
        '250432205145243649', // Jdender~#2316
        '251383432331001856', // Chronomly#8108
    ],
});

client.registry
    .registerDefaultTypes()
    .registerGroups([['general', 'The major commands of this bot']])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommands([]);

import Enmap from 'enmap';

declare module 'discord.js' {
    interface Client {
        // Guild : (User : MOTD)
        motds: Enmap<string, Record<string, string | undefined>>;
    }
}

client.motds = new Enmap({ name: 'motds' });

client.once('ready', () => {
    console.log(`Logged in as ${client.user?.tag}! (${client.user?.id})`);
});

client.on('guildMemberAdd', member => {
    member.roles.add(config.joinRoles);
});

// Change this to webhook based logging at some point
client.on('error', console.error);
process.on('uncaughtException', console.error);
process.on('unhandledRejection', console.error);

client.login(config.token);
