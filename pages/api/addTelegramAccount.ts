import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@lib/server/prisma';
import { getSession } from 'next-auth/client';
import { getUserInfo } from '@server/services/Telegram';

export default async function addTelegramAccount(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) return res.status(400).json({ message: 'Unauthorized' });

  const username = req.body.username as string;

  if (!username) return res.status(400).json({ message: 'Missing telegram username.' });

  // TODO: verify telegram payload
  // https://core.telegram.org/widgets/login

  const user = await getUserInfo(username);

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      telegramAccount: {
        upsert: {
          create: { id: user.userId, hash: user.accessHash },
          update: { id: user.userId, hash: user.accessHash },
        },
      },
    },
  });

  return res.json({ success: true });
}
