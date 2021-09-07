import { DiscordGuildMembershipResult } from '@lib/results/DiscordGuildMembershipResult';
import { DiscordRoleResult } from '@lib/results/DiscordRoleResult';
import { MissingResultDependency, RuleResult } from '@lib/results/RuleResult';
import { Rule } from '@lib/rules/Rule';
import prisma from '@lib/server/prisma';

const discordAccountForEthereumAccount = async (account: string) => {
  const discordAccount = await prisma.account.findFirst({
    where: {
      providerId: 'discord',
      user: {
        ethereumAccounts: {
          some: { account },
        },
      },
    },
    select: { providerAccountId: true, accessToken: true },
  });

  if (discordAccount === null) {
    throw new MissingResultDependency(new Error(`Discord account for ${account} not found.`));
  }

  return discordAccount;
};

export class Link {
  constructor(public rule: Rule, public results: RuleResult[]) {}

  async sync(account: string): Promise<boolean> {
    const desired = await this.rule.run(account);

    for (const result of this.results) {
      if (result instanceof DiscordGuildMembershipResult) {
        const { providerAccountId: userId, accessToken } = await discordAccountForEthereumAccount(
          account,
        );

        const current = await result.isEnabled(userId);
        if (current != desired) {
          await result.setState(desired, { userId, accessToken });
        }
      }

      if (result instanceof DiscordRoleResult) {
        const { providerAccountId: userId } = await discordAccountForEthereumAccount(account);
        const current = await result.isEnabled(userId);
        if (current != desired) {
          await result.setState(desired, { userId });
        }
      }
    }

    return desired;
  }
}
