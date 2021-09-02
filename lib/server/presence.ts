import { getFromServer } from '@server/services/Discord';

export async function isInDiscord(discordId: string) {
  try {
    await getFromServer(discordId);
    return true;
  } catch (error) {
    return false;
  }
}
