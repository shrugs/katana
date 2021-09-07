import { memoSingleton } from './MemoSingleton';
import { getRolesForUser as _getRolesForUser } from '@server/services/Discord';

const _getters = {};

const _key = (guildId: string, userId: string) => [guildId, userId].join(':');

// TODO: use actual memo function here
export const getRolesForUser = (
  guildId: string,
  userId: string,
): ReturnType<typeof _getRolesForUser> => {
  if (!_getters[_key(guildId, userId)]) {
    _getters[_key(guildId, userId)] = memoSingleton(() => _getRolesForUser(guildId, userId));
  }

  return _getters[_key(guildId, userId)]();
};
