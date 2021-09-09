import {
  addToChannel,
  ChannelInfo,
  isInChannel,
  removeFromChannel,
  UserInfo,
} from '@server/services/Telegram';
import { RuleResult, SetResultStateError, ResultDependency } from './RuleResult';

export class TelegramChannelMembershipResult extends RuleResult {
  constructor(private channel: ChannelInfo, description: string) {
    super(description);
  }

  getDependencies(): ResultDependency[] {
    return [ResultDependency.Telegram];
  }

  async isValid(): Promise<boolean> {
    return true;
  }

  async isEnabled(user: UserInfo): Promise<boolean> {
    return await isInChannel(this.channel, user);
  }

  async setState(enabled: boolean, user: UserInfo): Promise<void> {
    console.log(
      `${enabled ? 'Adding' : 'Removing'} user ${user.userId} to/from ${this.channel.channelId}.`,
    );
    try {
      if (enabled) {
        await addToChannel(this.channel, user);
      } else {
        await removeFromChannel(this.channel, user);
      }
    } catch (error) {
      throw new SetResultStateError(error);
    }
  }
}
