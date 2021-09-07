import { getAmuletsForAccount } from '@lib/repos/Amulets';
import { isValidUpgradeMaterial } from '@lib/UpgradeMaterials';
import { Rule } from './Rule';

export class HasAnyUpgradeMaterialRule implements Rule {
  constructor() {}

  async run(account: string): Promise<boolean> {
    const amulets = await getAmuletsForAccount(account);
    return amulets.some((amulet) => isValidUpgradeMaterial(amulet.poem));
  }
}
