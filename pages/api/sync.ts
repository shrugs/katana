import { AllCollections } from '@lib/collections/AllCollections';
import prisma from '@lib/server/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

export default async function sync(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) return res.status(400).json({ error: 'Unauthorized' });

  const slug = req.body.slug as string;
  if (slug && !AllCollections[slug]) return res.status(400).json({ error: 'Unknown collection.' });

  const collections = AllCollections[slug] ? [AllCollections[slug]] : Object.values(AllCollections);

  const ethereumAccounts = await prisma.ethereumAccount.findMany({
    where: { userId: session.user.id },
  });

  try {
    const results = await Promise.all(
      ethereumAccounts.flatMap((ethereumAccount) =>
        collections.map((collection) => collection.syncForAccount(ethereumAccount.account)),
      ),
    );

    return res.json({ results });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
