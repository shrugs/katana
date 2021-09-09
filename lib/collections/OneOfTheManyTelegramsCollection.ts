import { Link } from '@lib/links/Link';
import { TelegramChannelMembershipResult } from '@lib/results/TelegramChannelMembershipResult';
import { HasLootItemRule } from '@lib/rules/HasLootItemRule';
import { ChannelInfo } from '@server/services/Telegram';
import { Collection } from './Collection';

const CHANNEL_INFO: ChannelInfo = { channelId: 1577653326, accessHash: '-263672753778771138' };

const result = new TelegramChannelMembershipResult(CHANNEL_INFO, 'Join one of the many telegrams.');

const HasLootItem = new Link(new HasLootItemRule('weapon', /Katana/), [result]);

export const OneOfTheManyTelegramsCollection = new Collection([HasLootItem]);
