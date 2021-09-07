// in lieu of a database...

import { Collection } from './Collection';
import { KatanaDiscordCollection } from './KatanaDiscordCollection';

export const AllCollections: Record<string, Collection> = {
  katana: KatanaDiscordCollection,
  // TODO: upgrades
};
