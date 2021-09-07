import { Link } from '@lib/links/Link';
import { DiscordGuildMembershipResult } from '@lib/results/DiscordGuildMembershipResult';
import { DiscordRoleResult } from '@lib/results/DiscordRoleResult';
import { HasAnyUpgradeMaterialRule } from '@lib/rules/UpgradeMaterialRules';
import { Collection } from './Collection';

const UPGRADE_GUILD_ID = '884900074428203038';
const DEFAULT_UPGRADE_ROLE_ID = '884901814204510208';

const DiscordLink = new Link(new HasAnyUpgradeMaterialRule(), [
  new DiscordGuildMembershipResult(UPGRADE_GUILD_ID, 'Join the Upgrade Materials Discord'),
  new DiscordRoleResult(UPGRADE_GUILD_ID, DEFAULT_UPGRADE_ROLE_ID, `Receive the  in Discord`),
]);

export const UpgradeMaterialsCollection = new Collection([DiscordLink]);
