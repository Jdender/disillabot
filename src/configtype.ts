export interface Config {
    token: string;
    prefix: string;
    owners: string[];
    supportInvite: string;
    guilds: {
        [guildId: string]:
            | {
                  joinRoles?: string[];
                  adminRoles?: string[];
                  selfRoles?: {
                      [roleme: string]: string | undefined;
                  };
              }
            | undefined;
    };
}
