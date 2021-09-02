import prisma from '@server/helpers/prisma';
import {
  addRoleForUser,
  addToServer,
  getRolesForUser,
  removeFromServer,
  removeRoleForUser,
} from '@server/services/Discord';
import { getBagsInWallet } from 'loot-sdk';
import { isInDiscord } from './presence';
import { RolesForSlug, ServerIDForSlug } from './roles';

export async function syncForUser(userId: string, slug: string) {
  const guildId = ServerIDForSlug[slug];
  const { address } = await prisma.ethereumAccount.findFirst({ where: { userId } });
  const discordAccount = await prisma.account.findFirst({
    where: { userId, providerId: 'discord' },
  });

  console.log(
    `syncing user ${userId} with address ${address} and discord id ${discordAccount.providerAccountId}`,
  );

  const _isInDiscord = await isInDiscord(guildId, discordAccount.providerAccountId);
  const bags = await getBagsInWallet(address.toLowerCase());
  const filteredBags = bags.filter((bag) => bag.weapon.toLowerCase().includes('katana'));

  console.log(
    `${address} has ${filteredBags.length} katanas: (${filteredBags
      .map((bag) => bag.weapon)
      .join(', ')})`,
  );

  if (filteredBags.length == 0 && _isInDiscord) {
    // remove from discord
    try {
      console.log(`Removing ${discordAccount.providerAccountId} from server`);
      await removeFromServer(guildId, discordAccount.providerAccountId);
    } catch (error) {
      console.error(error);
    }
  }

  if (filteredBags.length > 0 && !_isInDiscord) {
    // add to discord
    try {
      console.log(`Adding ${discordAccount.providerAccountId} to server`);
      await addToServer(guildId, discordAccount.providerAccountId, discordAccount.accessToken);
    } catch (error) {
      console.error(error);
    }
  }

  if (filteredBags.length > 0) {
    // sync roles
    const weaponNames = filteredBags.map((bag) => {
      if (bag.weapon.includes('Katana of')) {
        const match = bag.weapon.match(/(Katana of [a-zA-Z]+)/);
        return match[0];
      }

      return bag.weapon;
    });

    const rolesToIds = RolesForSlug[slug];
    const relevantRoleIDs = Object.values(rolesToIds);

    const newRoleIds = weaponNames.map((name) => rolesToIds[name]);
    const { roles: existingRoleIds }: { roles: string[] } = await getRolesForUser(
      guildId,
      discordAccount.providerAccountId,
    );
    const existingItemRoles = existingRoleIds.filter((id) => relevantRoleIDs.includes(id));
    const toRemove = existingItemRoles?.filter((x) => !newRoleIds?.includes(x)) || [];
    const toAdd = newRoleIds?.filter((x) => !existingItemRoles?.includes(x)) || [];

    for (const roleId of toRemove) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      console.log('Removing role for user', roleId, discordAccount.providerAccountId);
      await removeRoleForUser(guildId, discordAccount.providerAccountId, roleId);
    }

    for (const roleId of toAdd) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      console.log('Adding role', roleId, 'to user', discordAccount.providerAccountId);
      await addRoleForUser(guildId, discordAccount.providerAccountId, roleId);
    }
  }

  await prisma.user.update({
    where: { id: userId },
    data: { lastChecked: new Date() },
  });
}
