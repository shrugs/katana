import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@server/helpers/prisma';
import { getSession } from 'next-auth/client';
import { isInDiscord } from '@lib/server/presence';

export default async function hasJoinedDestination(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) return res.status(400).json({ error: 'Unauthorized' });

  const account = await prisma.account.findFirst({
    where: {
      userId: session.user.id,
      providerId: 'discord',
    },
  });

  const hasJoinedDestination = await isInDiscord(account.providerAccountId);

  res.setHeader('Cache-Control', 's-maxage=10');

  return res.json({ hasJoinedDestination });
}
