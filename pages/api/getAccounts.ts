import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@lib/server/prisma';
import { getSession } from 'next-auth/client';

export default async function getAccounts(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) return res.status(400).json({ error: 'Unauthorized' });

  const accounts = await prisma.ethereumAccount.findMany({
    where: { userId: session.user.id },
    select: { account: true },
  });

  return res.json({ accounts });
}
