// in lieu of a database...

import { Collection } from './Collection';
import { KatanaDiscordCollection } from './KatanaDiscordCollection';
import { OneOfTheManyTelegramsCollection } from './OneOfTheManyTelegramsCollection';
import { UpgradeMaterialsCollection } from './UpgradeMaterialsCollection';

export const AllCollections: Record<string, Collection> = {
  katana: KatanaDiscordCollection,
  upgrade: UpgradeMaterialsCollection,
  oneofthemanytelegrams: OneOfTheManyTelegramsCollection,
};
