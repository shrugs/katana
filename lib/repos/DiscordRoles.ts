import { getRolesForUser as _getRolesForUser } from '@server/services/Discord';
import memoizee from 'memoizee';

export const getRolesForUser = memoizee(
  (guildId: string, userId: string) => _getRolesForUser(guildId, userId),
  { promise: true },
);
