import { DiscordGuildMembershipResult } from '@lib/results/DiscordGuildMembershipResult';
import { DiscordRoleResult } from '@lib/results/DiscordRoleResult';
import { MissingResultDependency, RuleResult } from '@lib/results/RuleResult';
import { TelegramChannelMembershipResult } from '@lib/results/TelegramChannelMembershipResult';
import { Rule } from '@lib/rules/Rule';
import prisma from '@lib/server/prisma';
import { UserInfo } from '@server/services/Telegram';

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

const telegramAccountForEthereumAccount = async (account: string): Promise<UserInfo> => {
  const telegramAccount = await prisma.telegramAccount.findFirst({
    where: {
      user: {
        ethereumAccounts: {
          some: { account },
        },
      },
    },
    select: { id: true, hash: true },
  });

  if (telegramAccount === null) {
    throw new MissingResultDependency(new Error(`Telegram account for ${account} not found.`));
  }

  return { userId: telegramAccount.id, accessHash: telegramAccount.hash };
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

      if (result instanceof TelegramChannelMembershipResult) {
        const user = await telegramAccountForEthereumAccount(account);
        const current = await result.isEnabled(user);
        if (current != desired) {
          await result.setState(desired, user);
        }
      }
    }

    return desired;
  }
}
