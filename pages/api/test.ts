import { KatanaDiscordCollection } from '@lib/collections/KatanaDiscordCollection';
import { getAmuletsForAccount } from '@lib/repos/Amulets';
import { isValidUpgradeMaterial, toValidUpgradeMaterial } from '@lib/UpgradeMaterials';
import { NextApiRequest, NextApiResponse } from 'next';

const valid = [
  `Dawn Star Fragment (Pure)`,
  `Dawn Star Fragment (Pure), 1`,
  `Umbral Raven's Feathers (Esoteric), 201`,
  'Star Fragment',
];
const invalid = ['whatever, 1'];

export default async function test(req: NextApiRequest, res: NextApiResponse) {
  // const assets = await getAmuletsForAccount('0xEC6d36A487d85CF562B7b8464CE8dc60637362AC');
  // await KatanaDiscordCollection.syncForAccount('0xEC6d36A487d85CF562B7b8464CE8dc60637362AC');
  valid.forEach((poem) => {
    console.log('valid?', poem, toValidUpgradeMaterial(poem));
  });

  invalid.forEach((poem) => {
    console.log('invalid?', poem, toValidUpgradeMaterial(poem));
  });

  return res.json({ done: true });
}
