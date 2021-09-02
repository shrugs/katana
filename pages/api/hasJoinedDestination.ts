import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@server/helpers/prisma';
import { getSession } from 'next-auth/client';
import { isInDiscord } from '@lib/server/presence';
import { ServerIDForSlug } from '@lib/server/roles';

export default async function hasJoinedDestination(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) return res.status(400).json({ error: 'Unauthorized' });

  const slug = req.query.slug as string;
  if (!slug) return res.status(400).json({ error: 'Unknown connection' });

  const account = await prisma.account.findFirst({
    where: {
      userId: session.user.id,
      providerId: 'discord',
    },
  });

  const guildId = ServerIDForSlug[slug];
  const hasJoinedDestination = await isInDiscord(guildId, account.providerAccountId);

  return res.json({ hasJoinedDestination });
}
