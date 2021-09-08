import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@lib/server/prisma';
import { getSession } from 'next-auth/client';

export default async function getSubscription(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) return res.status(400).json({ message: 'Unauthorized' });

  const collectionId = (req.query.collectionId ?? req.body.collectionId) as string;
  if (!collectionId) return res.status(400).json({ message: 'Expected collection id.' });

  switch (req.method) {
    case 'GET': {
      const subscription = await prisma.subscription.findUnique({
        where: { userId_collectionId: { userId: session.user.id, collectionId } },
        select: { id: true, collection: { select: { id: true } } },
      });

      return res.json({ subscription });
    }
    case 'POST': {
      const subscription = await prisma.subscription.upsert({
        where: { userId_collectionId: { userId: session.user.id, collectionId } },
        create: { userId: session.user.id, collectionId },
        update: {},
      });

      return res.json({ subscription });
    }
    case 'DELETE': {
      await prisma.subscription.delete({
        where: { userId_collectionId: { userId: session.user.id, collectionId } },
        select: { id: true, collection: { select: { id: true } } },
      });

      // TODO: clean up results from that collection (namely, kick from discord)

      return res.json({ subscription: null });
    }
  }
}
