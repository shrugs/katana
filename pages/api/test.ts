import { KatanaDiscordCollection } from '@lib/collections/KatanaDiscordCollection';
import { getAmuletsForAccount } from '@lib/repos/Amulets';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function test(req: NextApiRequest, res: NextApiResponse) {
  const assets = await getAmuletsForAccount('0xEC6d36A487d85CF562B7b8464CE8dc60637362AC');
  // await KatanaDiscordCollection.syncForAccount('0xEC6d36A487d85CF562B7b8464CE8dc60637362AC');

  return res.json({ done: true, assets });
}
