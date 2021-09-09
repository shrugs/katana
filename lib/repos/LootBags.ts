import { getBagsInWallet } from 'loot-sdk';
import memoizee from 'memoizee';

export const getLootBagsForAccount = memoizee(
  (account: string) => getBagsInWallet(account.toLowerCase()),
  { promise: true },
);
