import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@server/helpers/prisma';
import { getAddress, verifyMessage } from 'ethers/lib/utils';
import { getSession } from 'next-auth/client';
import { SIGNATURE_TEXT } from '@lib/constants';

export default async function addEthereumAccount(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) return res.status(400).json({ error: 'Unauthorized' });

  const signature = req.body.signature as string;
  const account = req.body.account as string;

  if (!signature || !account)
    return res.status(400).json({ error: 'Missing signature or account' });

  const address = getAddress(account);

  try {
    const verified = address == getAddress(verifyMessage(SIGNATURE_TEXT, signature));
    if (!verified) throw new Error();
  } catch (error) {
    return res.status(400).json({ error: 'Signature did not match up.' });
  }

  const existingEthereumAccount = await prisma.ethereumAccount.findFirst({
    where: {
      user: { id: session.user.id },
      address,
    },
  });

  if (!existingEthereumAccount) {
    await prisma.ethereumAccount.create({
      data: {
        userId: session.user.id,
        address,
        proof: signature,
      },
    });
  }

  return res.json({ success: true });
}
