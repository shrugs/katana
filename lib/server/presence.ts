import { getFromServer } from '@server/services/Discord';

export async function isInDiscord(guildId: string, discordId: string) {
  try {
    await getFromServer(guildId, discordId);
    return true;
  } catch (error) {
    return false;
  }
}
