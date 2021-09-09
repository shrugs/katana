import { BigNumber } from '@ethersproject/bignumber';
import { getERC20BalanceForAccount } from '@lib/repos/ERC20';
import { Rule } from './Rule';

export class ERC20BalanceRule implements Rule {
  constructor(private tokenAddress: string, private match: (balance: BigNumber) => boolean) {}

  async run(account: string): Promise<boolean> {
    const balance = await getERC20BalanceForAccount(account, this.tokenAddress);
    return this.match(balance);
  }
}
