import { BigNumber } from '@ethersproject/bignumber';
import { arrayify, hexZeroPad } from '@ethersproject/bytes';
import pMap from 'p-map';
import { OpenSeaAsset } from 'opensea-js/lib/types';
import memoizee from 'memoizee';
import { getAssetsInContract } from './AssetsInContract';

const AMULET_CONTRACT_ADDRESS = '0x2a2127753653f6210d26f5b470738bf13b73423d';

const getAmuletMetadata = (asset: OpenSeaAsset): Promise<AmuletMetadata> => {
  const paddedTokenId = hexZeroPad(arrayify(BigNumber.from(asset.tokenId)), 32).replace('0x', '');
  const uri = `https://at.amulet.garden/token/${paddedTokenId}.json`;
  return fetch(uri).then(async (res) => res.json());
};

interface AmuletMetadata {
  poem: string;
}

export const getAmuletsForAccount = memoizee(
  async (account: string) => {
    const assets = await getAssetsInContract(account, AMULET_CONTRACT_ADDRESS);

    return pMap(
      assets,
      async (asset) => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return getAmuletMetadata(asset);
      },
      { concurrency: 1 },
    );
  },
  { promise: true },
);
