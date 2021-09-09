import { getRolesForUser as _getRolesForUser } from '@server/services/Discord';
import memoizee from 'memoizee';
import { Contract } from '@ethersproject/contracts';
import { provider } from '@lib/chain/provider';
import { BigNumber } from '@ethersproject/bignumber';

const ERC20Abi = [
  {
    constant: true,
    inputs: [
      {
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];

export const getERC20BalanceForAccount = memoizee(
  async (account: string, tokenAddress: string): Promise<BigNumber> => {
    const contract = new Contract(tokenAddress, ERC20Abi, provider);
    const [balance] = await contract.functions['balanceOf'](account);
    return balance;
  },
  { promise: true },
);
