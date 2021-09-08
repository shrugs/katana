import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@lib/server/prisma';
import { getSession } from 'next-auth/client';
import { ResultDependency } from '@lib/results/RuleResult';

export default async function getAccounts(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) return res.status(400).json({ error: 'Unauthorized' });

  const discordAccount = await prisma.account.findFirst({
    where: { userId: session.user.id, providerId: 'discord' },
  });

  const telegramAccount = await prisma.telegramAccount.findFirst({
    where: { userId: session.user.id },
  });

  return res.json({
    [ResultDependency.Discord]: !!discordAccount,
    [ResultDependency.Telegram]: !!telegramAccount,
  });
}
