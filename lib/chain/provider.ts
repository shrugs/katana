import { ethers } from 'ethers';

export const provider = new ethers.providers.InfuraProvider(
  1,
  process.env.NEXT_PUBLIC_INFURA_PROJECT_ID,
);
