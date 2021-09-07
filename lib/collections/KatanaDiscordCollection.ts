import { Link } from '@lib/links/Link';
import { DiscordGuildMembershipResult } from '@lib/results/DiscordGuildMembershipResult';
import { DiscordRoleResult } from '@lib/results/DiscordRoleResult';
import { HasLootItemRule } from '@lib/rules/HasLootItemRule';
import { Collection } from './Collection';

const KATANA_GUILD_ID = '882592452081512448';
const RoleIdForWeapon = {
  Katana: '883011694241120346',
  'Katana of Power': '883011852165062668',
  'Katana of Detection': '883011903440429056',
  'Katana of Perfection': '883013555685851138',
  'Katana of Reflection': '883011951674925086',
  'Katana of Fury': '883011999620005929',
  'Katana of Vitriol': '883012045660893224',
  'Katana of Rage': '883012164498104350',
  'Katana of the Fox': '883012198748811355',
  'Katana of Skill': '883012239303508019',
  'Katana of Brilliance': '883012276557340743',
  'Katana of Titans': '883012321637703720',
  'Katana of Protection': '883012362427310200',
  'Katana of Enlightenment': '883012404466823199',
  'Katana of the Twins': '883012449010343936',
  'Katana of Anger': '883012491330879590',
  'Katana of Giants': '883012524222578759',
};

const DiscordLink = new Link(new HasLootItemRule('weapon', /Katana/), [
  new DiscordGuildMembershipResult(KATANA_GUILD_ID, 'Join the Katana Discord'),
]);

const RoleLinks = Object.keys(RoleIdForWeapon).map(
  (weapon) =>
    new Link(new HasLootItemRule('weapon', new RegExp(weapon)), [
      new DiscordRoleResult(
        KATANA_GUILD_ID,
        RoleIdForWeapon[weapon],
        `Receive the '${weapon}' Role in the Katana Discord`,
      ),
    ]),
);

export const KatanaDiscordCollection = new Collection([DiscordLink, ...RoleLinks]);
