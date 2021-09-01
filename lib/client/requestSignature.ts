import { SIGNATURE_TEXT } from '@lib/constants';
import type { Web3Provider } from '@ethersproject/providers';

export const requestSignature = (provider: Web3Provider, account: string) =>
  provider.send('personal_sign', [SIGNATURE_TEXT, account]);
