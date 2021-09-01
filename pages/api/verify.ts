import { syncForUser } from '@lib/server/sync';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

export default async function verify(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) return res.status(400).json({ error: 'Unauthorized' });

  await syncForUser(session.user.id);

  return res.json({ success: true });
}
