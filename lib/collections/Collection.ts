import { Link } from '@lib/links/Link';
import { ResultDependency } from '@lib/results/RuleResult';
import pMap from 'p-map';

export type CollectionDependency = ResultDependency | 'ethereum' | 'session';

export class Collection {
  constructor(public links: Link[]) {}

  async test(account: string): Promise<boolean[]> {
    return pMap(this.links, (link) => link.test(account), { concurrency: 1 });
  }

  async sync(account: string): Promise<boolean[]> {
    return pMap(this.links, (link) => link.sync(account), { concurrency: 1 });
  }
}
