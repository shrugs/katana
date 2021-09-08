import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@lib/server/prisma';
import { getAddress, verifyMessage } from 'ethers/lib/utils';
import { getSession } from 'next-auth/client';
import { SIGNATURE_TEXT } from '@lib/constants';

export default async function addEthereumAccount(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) return res.status(400).json({ message: 'Unauthorized' });

  const signature = req.body.signature as string;
  const _account = req.body.account as string;

  if (!signature || !_account)
    return res.status(400).json({ message: 'Missing signature or account' });

  const account = getAddress(_account);

  try {
    const verified = account == getAddress(verifyMessage(SIGNATURE_TEXT, signature));
    if (!verified) throw new Error();
  } catch (error) {
    return res.status(400).json({ message: 'Signature did not match up.' });
  }

  const existingEthereumAccount = await prisma.ethereumAccount.findFirst({
    where: {
      user: { id: session.user.id },
      account,
    },
  });

  if (!existingEthereumAccount) {
    await prisma.ethereumAccount.create({
      data: {
        userId: session.user.id,
        account,
        proof: signature,
      },
    });
  }

  return res.json({ success: true });
}
