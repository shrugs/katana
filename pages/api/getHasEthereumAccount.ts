import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@lib/server/prisma';
import { getSession } from 'next-auth/client';

export default async function getHasEthereumAccount(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) return res.status(400).json({ message: 'Unauthorized' });

  const ethereumAccount = await prisma.ethereumAccount.findFirst({
    where: { userId: session.user.id },
    select: { account: true },
  });

  return res.json({ hasEthereumAccount: !!ethereumAccount });
}
