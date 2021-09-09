import { getAssetsInContract } from '@lib/repos/AssetsInContract';
import { OpenSeaAsset } from 'opensea-js/lib/types';
import { Rule } from './Rule';

export class AssetBalanceRule implements Rule {
  constructor(private tokenAddress: string, private match: (assets: OpenSeaAsset[]) => boolean) {}

  async run(account: string): Promise<boolean> {
    const assets = await getAssetsInContract(account, this.tokenAddress);
    return this.match(assets);
  }
}
