import { BigNumber } from '@ethersproject/bignumber';
import { arrayify, hexZeroPad } from '@ethersproject/bytes';
import { fetchAllAssets } from '@lib/opensea/opensea';
import { memoSingleton } from './MemoSingleton';
import pMap from 'p-map';
import { OpenSeaAsset } from 'opensea-js/lib/types';

const AMULET_CONTRACT_ADDRESS = '0x2a2127753653f6210d26f5b470738bf13b73423d';

const _getters = {};

const getAmuletMetadata = (asset: OpenSeaAsset): Promise<AmuletMetadata> => {
  const paddedTokenId = hexZeroPad(arrayify(BigNumber.from(asset.tokenId)), 32).replace('0x', '');
  const uri = `https://at.amulet.garden/token/${paddedTokenId}.json`;
  return fetch(uri).then(async (res) => res.json());
};

interface AmuletMetadata {
  poem: string;
}

// TODO: use actual memo function here
export const getAmuletsForAccount = (account: string): Promise<AmuletMetadata[]> => {
  if (!_getters[account]) {
    _getters[account] = memoSingleton(async () => {
      const assets = await fetchAllAssets({
        asset_contract_address: AMULET_CONTRACT_ADDRESS,
        owner: account,
      });

      return pMap(
        assets,
        async (asset) => {
          await new Promise((resolve) => setTimeout(resolve, 100));
          return getAmuletMetadata(asset);
        },
        { concurrency: 1 },
      );
    });
  }

  return _getters[account]();
};
