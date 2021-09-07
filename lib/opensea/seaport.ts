import { Network, OpenSeaPort } from 'opensea-js';
import { provider } from '../chain/provider';

export const seaport = new OpenSeaPort(provider, { networkName: Network.Main });
