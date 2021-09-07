import { getLootBagsForAccount } from '@lib/repos/LootBags';
import { Rule } from './Rule';

export class HasLootItemRule implements Rule {
  constructor(private slot: string, private match: RegExp) {}

  async run(account: string): Promise<boolean> {
    const bags = await getLootBagsForAccount(account);
    return bags.some((bag) => this.match.test(bag[this.slot]));
  }
}
