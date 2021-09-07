import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@lib/server/prisma';
import { getSession } from 'next-auth/client';
import { AllCollections } from '@lib/collections/AllCollections';
import { DiscordGuildMembershipResult } from '@lib/results/DiscordGuildMembershipResult';

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

  const result = AllCollections[slug].links[0].results[0] as DiscordGuildMembershipResult;
  const hasJoinedDestination = await result.isEnabled(account.providerAccountId);

  return res.json({ hasJoinedDestination });
}
