import prisma from '@lib/server/prisma';
import { syncSubscription } from '@lib/server/sync';
import dayjs from 'dayjs';
import { NextApiHandler } from 'next';
import pMap from 'p-map';

const api: NextApiHandler = async (_req, res) => {
  const subscriptions = await prisma.subscription.findMany({
    where: { lastSynced: { lt: dayjs().subtract(1, 'minute').toDate() } },
    select: { userId: true, collectionId: true },
  });

  await pMap(subscriptions, (sub) => syncSubscription(sub.userId, sub.collectionId), {
    concurrency: 2,
  });

  return res.json({ success: true });
};

export default api;
