import { syncSubscription } from '@lib/server/sync';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

export default async function sync(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) return res.status(400).json({ message: 'Unauthorized' });

  const collectionId = req.body.collectionId as string;
  if (!collectionId) return res.status(400).json({ message: 'Expected collection id.' });

  try {
    const results = await syncSubscription(session.user.id, collectionId);

    return res.json({ results });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
