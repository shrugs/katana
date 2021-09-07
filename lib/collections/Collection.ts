import { Link } from '@lib/links/Link';
import pMap from 'p-map';

export class Collection {
  constructor(public links: Link[]) {}

  async syncForAccount(account: string): Promise<boolean[]> {
    return pMap(this.links, (link) => link.sync(account), { concurrency: 1 });
  }
}
