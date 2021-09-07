import { addToServer, getFromServer, removeFromServer } from '@server/services/Discord';
import { RuleResult, SetResultStateError } from './RuleResult';

export class DiscordGuildMembershipResult extends RuleResult {
  constructor(private guildId: string, description: string) {
    super(description);
  }

  async isValid(): Promise<boolean> {
    return true;
  }

  async isEnabled(userId: string): Promise<boolean> {
    return await this.isInGuild(userId);
  }

  async setState(
    enabled: boolean,
    { userId, accessToken }: { userId: string; accessToken?: string },
  ): Promise<void> {
    // enacts the provided state
    console.log(`${enabled ? 'Adding' : 'Removing'} user ${userId} to/from ${this.guildId}.`);
    try {
      if (enabled) {
        await addToServer(this.guildId, userId, accessToken);
      } else {
        await removeFromServer(this.guildId, userId);
      }
    } catch (error) {
      throw new SetResultStateError(error);
    }
  }

  private async isInGuild(discordId: string) {
    try {
      await getFromServer(this.guildId, discordId);
      return true;
    } catch (error) {
      return false;
    }
  }
}
