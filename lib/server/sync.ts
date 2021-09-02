import prisma from '@server/helpers/prisma';
import {
  addRoleForUser,
  addToServer,
  getRolesForUser,
  removeFromServer,
  removeRoleForUser,
} from '@server/services/Discord';
import { getBagsInWallet } from 'loot-sdk';
import type { Bag } from 'loot-sdk/dist/types';
import { isInDiscord } from './presence';
import { RolesForSlug, ServerIDForSlug } from './roles';

function roleNamesForBagsInSlug(slug: string, bags: Bag[]) {
  if (slug === 'katana') {
    return bags
      .map((bag) => {
        if (bag.weapon.includes('Katana of')) {
          const match = bag.weapon.match(/(Katana of [a-zA-Z]+)/);
          return match[0];
        }

        return bag.weapon.includes('Katana') ? 'Katana' : undefined;
      })
      .filter(Boolean);
  }

  if (slug === 'lootwars') {
    return bags
      .map((bag) => {
        if (bag.weapon.includes('Warhammer')) return 'Warhammer';
        if (bag.weapon.includes('Quarterstaff')) return 'Quarterstaff';
        if (bag.weapon.includes('Maul')) return 'Maul';
        if (bag.weapon.includes('Mace')) return 'Mace';
        if (bag.weapon.includes('Club')) return 'Club';
        if (bag.weapon.includes('Katana')) return 'Katana';
        if (bag.weapon.includes('Falchion')) return 'Falchion';
        if (bag.weapon.includes('Scimitar')) return 'Scimitar';
        if (bag.weapon.includes('Long Sword')) return 'Long Sword';
        if (bag.weapon.includes('Short Sword')) return 'Short Sword';
        if (bag.weapon.includes('Ghost Wand')) return 'Ghost Wand';
        if (bag.weapon.includes('Grave Wand')) return 'Grave Wand';
        if (bag.weapon.includes('Bone Wand')) return 'Bone Wand';
        if (bag.weapon.includes('Wand')) return 'Wand';
        if (bag.weapon.includes('Grimoire')) return 'Grimoire';
        if (bag.weapon.includes('Chronicle')) return 'Chronicle';
        if (bag.weapon.includes('Tome')) return 'Tome';
        if (bag.weapon.includes('Book')) return 'Book';
      })
      .filter(Boolean);
  }

  return [];
}

export async function syncForUser(userId: string, slug: string) {
  const guildId = ServerIDForSlug[slug];
  const weaponNameToRoleId = RolesForSlug[slug];
  const roleIdsInGuild = Object.values(weaponNameToRoleId);

  const { address } = await prisma.ethereumAccount.findFirst({ where: { userId } });
  const discordAccount = await prisma.account.findFirst({
    where: { userId, providerId: 'discord' },
  });

  console.log(
    `syncing user ${userId} with address ${address} and discord id ${discordAccount.providerAccountId}`,
  );

  const _isInDiscord = await isInDiscord(guildId, discordAccount.providerAccountId);
  const bags = await getBagsInWallet(address.toLowerCase());

  const roleNames = roleNamesForBagsInSlug(slug, bags);

  console.log(`${address} has ${roleNames.length} items: (${roleNames.join(', ')})`);

  // if (filteredBags.length == 0 && _isInDiscord) {
  //   // remove from discord
  //   try {
  //     console.log(`Removing ${discordAccount.providerAccountId} from server`);
  //     await removeFromServer(guildId, discordAccount.providerAccountId);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  if (roleNames.length > 0 && !_isInDiscord) {
    // add to discord
    try {
      console.log(`Adding ${discordAccount.providerAccountId} to server`);
      await addToServer(guildId, discordAccount.providerAccountId, discordAccount.accessToken);
    } catch (error) {
      console.error(error);
    }
  }

  if (roleNames.length > 0) {
    const newRoleIds = roleNames.map((name) => weaponNameToRoleId[name]);

    const { roles: existingRoleIds }: { roles: string[] } = isInDiscord
      ? await getRolesForUser(guildId, discordAccount.providerAccountId)
      : { roles: [] };

    const existingItemRoles = existingRoleIds.filter((id) => roleIdsInGuild.includes(id));
    const toRemove = existingItemRoles.filter((x) => !newRoleIds?.includes(x)) || [];
    const toAdd = newRoleIds.filter((x) => !existingItemRoles?.includes(x)) || [];

    // sync roles
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
