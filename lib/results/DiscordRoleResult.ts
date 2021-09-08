import { getRolesForUser } from '@lib/repos/DiscordRoles';
import { addRoleForUser, removeRoleForUser } from '@server/services/Discord';
import { ResultDependency, RuleResult, SetResultStateError } from './RuleResult';

export class DiscordRoleResult extends RuleResult {
  constructor(private guildId: string, private roleId: string, description: string) {
    super(description);
  }

  getDependencies(): ResultDependency[] {
    return [ResultDependency.Discord];
  }

  async isValid(): Promise<boolean> {
    // TODO: check to see if the bot is in the discord and can assign roles correctly
    return true;
  }

  async isEnabled(userId: string): Promise<boolean> {
    const response = await getRolesForUser(this.guildId, userId);
    return (response.roles as string[]).some((_id) => _id === this.roleId);
  }

  async setState(enabled: boolean, { userId }: { userId: string }): Promise<void> {
    // enacts the provided state
    console.log(
      `${enabled ? 'Adding' : 'Removing'} role ${this.roleId} in ${this.guildId} from ${userId}.`,
    );

    try {
      if (enabled) {
        await addRoleForUser(this.guildId, userId, this.roleId);
      } else {
        await removeRoleForUser(this.guildId, userId, this.roleId);
      }
    } catch (error) {
      throw new SetResultStateError(error);
    }
  }
}
