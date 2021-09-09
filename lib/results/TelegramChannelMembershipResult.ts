import { RuleResult, SetResultStateError, ResultDependency } from './RuleResult';

export class TelegramChannelMembershipResult extends RuleResult {
  constructor(private channelId: string, private hash: string, description: string) {
    super(description);
  }

  getDependencies(): ResultDependency[] {
    return [ResultDependency.Telegram];
  }

  async isValid(): Promise<boolean> {
    return true;
  }

  async isEnabled(userId: string, hash: string): Promise<boolean> {
    return await this.isInChannel(userId, hash);
  }

  async setState(
    enabled: boolean,
    { userId, hash }: { userId: string; hash: string },
  ): Promise<void> {
    console.log(`${enabled ? 'Adding' : 'Removing'} user ${userId} to/from ${this.channelId}.`);
    try {
      if (enabled) {
        // await addToServer(this.guildId, userId, accessToken);
      } else {
        // await removeFromServer(this.guildId, userId);
      }
    } catch (error) {
      throw new SetResultStateError(error);
    }
  }

  private async isInChannel(userId: string, hash: string) {
    try {
      // await getFromServer(this.guildId, discordId);
      return true;
    } catch (error) {
      return false;
    }
  }
}
