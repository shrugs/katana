// in lieu of a database...

import { Collection } from './Collection';
import { KatanaDiscordCollection } from './KatanaDiscordCollection';
import { UpgradeMaterialsCollection } from './UpgradeMaterialsCollection';

export const AllCollections: Record<string, Collection> = {
  katana: KatanaDiscordCollection,
  upgrade: UpgradeMaterialsCollection,
};
