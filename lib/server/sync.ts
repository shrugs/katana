import { AllCollections } from '@lib/collections/AllCollections';
import prisma from '@lib/server/prisma';

export async function syncSubscription(userId: string, collectionId: string) {
  const ethereumAccounts = await prisma.ethereumAccount.findMany({
    where: { userId },
  });

  const { slug } = await prisma.collection.findUnique({
    where: { id: collectionId },
    select: { slug: true },
  });

  return await Promise.all(
    ethereumAccounts.flatMap((ethereumAccount) =>
      AllCollections[slug].sync(ethereumAccount.account),
    ),
  );
}
