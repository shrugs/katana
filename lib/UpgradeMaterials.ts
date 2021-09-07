const INFUSIONS = [
  'Dawn',
  'Dark',
  'Cursed',
  'Blessed',
  'Umbral',
  'Enchanted',
  'Charmed',
  'Royal',
  'Frozen',
];

const MATERIALS = [
  'Star Fragment',
  'Titanite',
  'Bladestone',
  'Blood Rock',
  'Lumenite Crystal',
  'Clay Augur',
  'Hide',
  'Cloud Essence',
  'Lapis Lazuli',
  "Raven's Feathers",
  'Scrap',
  'Fire Seed',
  'Palo Santo ',
  'Sapphire',
  'Prismatic Shard',
  'Liquid Augur',
  'Runestone',
  'Ashes',
  'Slime',
  'Forest Dust',
  'Gardenia Jasmine',
  'Lightning Ore',
  'Iridium',
  'Reagent',
  'Twinkling Korthite',
  'Ingot',
  'Parchment',
  'Fur',
  'Sunstone',
  'Chromatic Dye',
  'Fang',
  'Moonstone',
  'Onyx',
  'Scale',
  'Wax',
  'Resin',
  'Gourd',
  'Seedling',
  'Lotus',
  'Remnant',
  'Horn',
  'Moss',
  'Balm',
  'Opal',
];

const MODIFIERS = [
  '(Pure)',
  '(Occluded)',
  '(Obscure)',
  '(Simple)',
  '(Pallid)',
  'of the Alchemist',
  '(Raw)',
  'of the Blasphemer',
  '(Celestial)',
  'of Shriving',
  '(Heavy)',
  '(Floating)',
  '(Esoteric)',
  'of Avowal',
  '(Alluring)',
];

const group = (words: string[]) =>
  words.map((word) => word.replace('(', '\\(').replace(')', '\\)')).join('|');

const REGEX = new RegExp(
  `^((${group(INFUSIONS)}) )?(${group(MATERIALS)})( (${group(MODIFIERS)}))?(, (\\d+))?$`,
);

export interface UpgradeMaterial {
  infusion: string;
  material: string;
  modifier: string;
  count: number;
}

export function toValidUpgradeMaterial(poem: string): UpgradeMaterial {
  if (!isValidUpgradeMaterial(poem)) return null;
  const matches = poem.match(REGEX);
  const count = matches[7] ? parseInt(matches[7]) : 1;
  return { infusion: matches[2], material: matches[3], modifier: matches[5], count };
}

export function isValidUpgradeMaterial(poem: string) {
  return REGEX.test(poem);
}
