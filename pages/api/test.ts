import { KatanaDiscordCollection } from '@lib/collections/KatanaDiscordCollection';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function test(req: NextApiRequest, res: NextApiResponse) {
  await KatanaDiscordCollection.syncForAccount('0xEC6d36A487d85CF562B7b8464CE8dc60637362AC');

  return res.json({ done: true });
}
