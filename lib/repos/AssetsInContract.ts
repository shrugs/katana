import { fetchAllAssets } from '@lib/opensea/opensea';
import memoizee from 'memoizee';

export const getAssetsInContract = memoizee(
  async (account: string, contractAddress: string) =>
    fetchAllAssets({
      asset_contract_address: contractAddress,
      owner: account,
    }),
  { promise: true },
);
