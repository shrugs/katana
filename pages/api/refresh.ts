import prisma from '@lib/server/prisma';
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

  // TODO: get the list of a user's subscribed collections, then run those

  // for (const user of usersToRefresh) {
  //   await syncForUser(user.id, 'katana');
  // }

  return res.json({ success: true });
};

export default api;
