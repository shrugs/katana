import { Rule } from './Rule';

export class SomeRule implements Rule {
  constructor(private rules: Rule[]) {}

  async run(account: string): Promise<boolean> {
    for (const rule of this.rules) {
      const passed = await rule.run(account);
      if (passed) return true;
    }

    return false;
  }
}
