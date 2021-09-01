import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@server/helpers/prisma';
import { getSession } from 'next-auth/client';
import { getFromServer } from '@server/services/Discord';

export default async function hasJoinedDestination(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) return res.status(400).json({ error: 'Unauthorized' });

  const accounts = await prisma.account.findMany({
    where: {
      userId: session.user.id,
      providerId: 'discord',
    },
  });

  for (const account of accounts) {
    const data = await getFromServer(account.providerAccountId);
    if (data.code) {
      return res.status(400).json({ error: `${data.code} ${data.message}` });
    }
  }

  return res.json({ hasJoinedDestination: true });
}
