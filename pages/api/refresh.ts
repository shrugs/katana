import prisma from '@server/helpers/prisma';
import {
  addRoleForUser,
  AdminRoleID,
  getRolesForUser,
  removeFromServer,
  removeRoleForUser,
  RolesToIDs,
} from '@server/services/Discord';
import dayjs from 'dayjs';
import { getBagsInWallet } from 'loot-sdk';
import { NextApiHandler } from 'next';

const api: NextApiHandler = async (_req, res) => {
  // const usersToRefresh = await prisma.user.findMany({
  //   where: {
  //     accounts: { some: { providerType: 'discord' } },
  //     lastChecked: { lt: dayjs().subtract(1, 'minute').toDate() },
  //   },
  // });
  // for (const user of usersToRefresh) {

  return res.json({ success: true });
};

export default api;
