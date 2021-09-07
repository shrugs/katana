import { getBagsInWallet } from 'loot-sdk';
import { memoSingleton } from './MemoSingleton';

const _getters = {};

// TODO: use actual memo function here
export const getLootBagsForAccount = (account: string): ReturnType<typeof getBagsInWallet> => {
  if (!_getters[account]) {
    _getters[account] = memoSingleton(() => getBagsInWallet(account.toLowerCase()));
  }

  return _getters[account]();
};
