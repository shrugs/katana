import { ResultDependency } from '@lib/results/RuleResult';
import { Box } from '@elements/Box';
import { ErrorText, Paragraph } from '@elements/Typography';
import { Button } from '@elements/Button';
import { requestSignature } from '@lib/client/requestSignature';
import { useWallet } from '@gimmixorg/use-wallet';
import WalletConnectProvider from '@walletconnect/web3-provider';
import type { ICoreOptions } from 'web3modal';
import { useCallback } from 'react';
import { mutator } from '@lib/client/mutator';
import { DependencyState } from '@containers/DependencyState';
import { CollectionDependency } from '@lib/collections/Collection';
import { signIn, useSession } from 'next-auth/client';

const WALLET_CONNECT_OPTIONS: Partial<ICoreOptions> = {
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID,
      },
    },
  },
  theme: 'dark',
};

function renderText(dep: CollectionDependency) {
  switch (dep) {
    case 'ethereum':
      return `Ethereum address required.`;
    case ResultDependency.Discord:
      return `Discord account required.`;
    case ResultDependency.Telegram:
      return `Telegram Account required.`;
  }
}

const submitEthereumAccount = (body: { account: string; signature: string }) =>
  mutator('/api/addEthereumAccount', body);

function ConnectAccountButton({ fulfilled, loading }: { fulfilled: boolean; loading: boolean }) {
  const { refetchEthereumAccount } = DependencyState.useContainer();
  const [session] = useSession();
  const canConnectAccount = !!session;

  const { connect, provider, account } = useWallet();

  const signAndAddEthereumAccount = useCallback(async () => {
    if (!provider || !account) return;
    const signature = await requestSignature(provider, account);
    await submitEthereumAccount({ account, signature });
    refetchEthereumAccount();
  }, [account, provider, refetchEthereumAccount]);

  if (fulfilled) {
    return <Button disabled>Ethereum Connected!</Button>;
  }

  if (!account) {
    return (
      <Button
        onClick={() => connect(WALLET_CONNECT_OPTIONS)}
        loading={loading}
        disabled={!canConnectAccount}
      >
        Connect Wallet
      </Button>
    );
  }

  return (
    <Button onClick={signAndAddEthereumAccount} loading={loading} disabled={!canConnectAccount}>
      Verify Wallet Address
    </Button>
  );
}

export function DependencyLineItem({ dependency }: { dependency: ResultDependency | 'ethereum' }) {
  const { dependencyStates, loadingStates, errors } = DependencyState.useContainer();
  const fulfilled = dependencyStates[dependency];
  const loading = loadingStates[dependency];
  const error = errors[dependency];

  return (
    <Box css={{ col: true, sy: '$2' }}>
      <Paragraph
        css={{
          textDecoration: fulfilled ? 'line-through' : 'none',
          opacity: fulfilled ? '50%' : '100%',
        }}
      >
        {renderText(dependency)}
      </Paragraph>
      {(() => {
        switch (dependency) {
          case 'ethereum':
            return <ConnectAccountButton fulfilled={fulfilled} loading={loading} />;
          case ResultDependency.Discord:
            return (
              <Button
                variant="discord"
                onClick={() => signIn('discord')}
                disabled={fulfilled}
                loading={loading}
              >
                {fulfilled ? 'Discord Connected!' : 'Sign in with Discord'}
              </Button>
            );
          case ResultDependency.Telegram:
            return (
              <script
                src="https://telegram.org/js/telegram-widget.js?15"
                data-telegram-login="katanagardenbot"
                data-size="large"
                data-auth-url="https://localhost:3000/api/auth/telegram?returnto=/"
                async
              />
            );
        }
      })()}
      {error && <ErrorText>{error.message}</ErrorText>}
    </Box>
  );
}
