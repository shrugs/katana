import { KatanaDiscordCollection } from '@lib/collections/KatanaDiscordCollection';
import { OneOfTheManyTelegramsCollection } from '@lib/collections/OneOfTheManyTelegramsCollection';
import { getAmuletsForAccount } from '@lib/repos/Amulets';
import { getERC20BalanceForAccount } from '@lib/repos/ERC20';
import { isValidUpgradeMaterial, toValidUpgradeMaterial } from '@lib/UpgradeMaterials';
import {
  addToChannel,
  exportInvite,
  getChannelInfo,
  getUserInfo,
  isInChannel,
  removeFromChannel,
  sendMessage,
} from '@server/services/Telegram';
import { NextApiRequest, NextApiResponse } from 'next';

const CHANNEL_INFO = { channelId: 1577653326, accessHash: '-263672753778771138' };
const MY_INFO = {
  userId: 397222621,
  accessHash: '8733306531727977696',
};
const MATTS_INFO = {
  userId: 913097002,
  accessHash: '2193018302896323425',
};

export default async function test(req: NextApiRequest, res: NextApiResponse) {
  // const assets = await getAmuletsForAccount('0xEC6d36A487d85CF562B7b8464CE8dc60637362AC');
  // await KatanaDiscordCollection.sync('0xEC6d36A487d85CF562B7b8464CE8dc60637362AC');

  // const mattS = await getUserInfo('matthewstephenson');
  // console.log(mattS, MATTS_INFO);s

  // // const response = await addToChannel(CHANNEL_INFO, MY_INFO);
  // // const response = await addToChannel(CHANNEL_INFO, MATTS_INFO);
  // const response = await removeFromChannel(CHANNEL_INFO, MATTS_INFO);
  // console.log(response);

  console.log(
    await OneOfTheManyTelegramsCollection.test('0xEC6d36A487d85CF562B7b8464CE8dc60637362AC'),
  );

  return res.json({ done: true });
}
