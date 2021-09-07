import { Link } from '@lib/links/Link';

export class Collection {
  constructor(public links: Link[]) {}

  async syncForAccount(account: string): Promise<void> {
    for (const link of this.links) {
      await link.sync(account);
    }
  }
}
