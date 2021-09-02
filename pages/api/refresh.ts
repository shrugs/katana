import { syncForUser } from '@lib/server/sync';
import prisma from '@server/helpers/prisma';
import dayjs from 'dayjs';
import { NextApiHandler } from 'next';

const api: NextApiHandler = async (_req, res) => {
  const usersToRefresh = await prisma.user.findMany({
    where: {
      accounts: { some: { providerType: 'discord' } },
      lastChecked: { lt: dayjs().subtract(1, 'minute').toDate() },
    },
    select: { id: true },
  });

  for (const user of usersToRefresh) {
    await syncForUser(user.id);
  }

  return res.json({ success: true });
};

export default api;
