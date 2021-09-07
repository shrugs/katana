import { OpenSeaAsset, OpenSeaAssetQuery } from 'opensea-js/lib/types';
import { seaport } from './seaport';

const LIMIT = 50;

export async function fetchAllAssets(query: OpenSeaAssetQuery) {
  const assets: OpenSeaAsset[] = [];
  let offset = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const result = await seaport.api.getAssets({
      ...query,
      limit: LIMIT,
      offset,
    });

    const page = result.assets;
    assets.push(...page);
    if (page.length < LIMIT) break;
    offset += page.length;
  }

  return assets;
}
