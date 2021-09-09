import { Link } from '@lib/links/Link';
import { TelegramChannelMembershipResult } from '@lib/results/TelegramChannelMembershipResult';
import { ERC20BalanceRule } from '@lib/rules/ERC20BalanceRule';
import { AssetBalanceRule } from '@lib/rules/AssetBalanceRule';
import { ChannelInfo } from '@server/services/Telegram';
import { Collection } from './Collection';

const CHANNEL_INFO: ChannelInfo = { channelId: 1577653326, accessHash: '-263672753778771138' };
const PETAL_CONTRACT_ADDRESS = '0x64dcffC50594450338B78496517102562A66faA5';
const MATTS_CONTRACT_ADDRESS = '0x28959cf125ccb051e70711d0924a62fb28eaf186';
const TROLLS_CONTRACT_ADDRESS = '0x240eb6b465f61dfc965053791f963cd0f0e4fdb0';

const result = new TelegramChannelMembershipResult(CHANNEL_INFO, 'Join one of the many telegrams.');

const HasAnyPetal = new Link(
  new ERC20BalanceRule(PETAL_CONTRACT_ADDRESS, (balance) => balance.gt(0)),
  [result],
);

const HasAnyMatts = new Link(
  new AssetBalanceRule(MATTS_CONTRACT_ADDRESS, (assets) => assets.length > 0),
  [result],
);

const HasAnyTrolls = new Link(
  new AssetBalanceRule(TROLLS_CONTRACT_ADDRESS, (assets) => assets.length > 0),
  [result],
);

export const OneOfTheManyTelegramsCollection = new Collection([
  HasAnyPetal,
  HasAnyMatts,
  HasAnyTrolls,
]);
