import { GetServerSideProps } from 'next';
import { ComponentPropsWithoutRef, useMemo, useCallback, useState } from 'react';
import { useWallet } from '@gimmixorg/use-wallet';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { signIn, useSession } from 'next-auth/client';
import type { ICoreOptions } from 'web3modal';
import { requestSignature } from '@lib/client/requestSignature';
import useSWR from 'swr';
import { Button } from '@app/elements/Button';
import { Box } from '@app/elements/Box';
import { Paragraph, Title } from '@app/elements/Typography';
import { useRouter } from 'next/dist/client/router';
import { AllCollections } from '@lib/collections/AllCollections';
import { styled } from 'stitches.config';

const ErrorText = styled(Paragraph, { color: 'Red' });

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

function doSync(body: { slug: string }) {
  return fetch('/api/sync', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

function submitEthereumAccount(body: { account: string; signature: string }) {
  return fetch('/api/addEthereumAccount', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

export function JoinPage({ title }: { title: string }) {
  const router = useRouter();
  const slug = router.query.slug as string;
  const [session, loadingSession] = useSession();
  const { connect, provider, account } = useWallet();

  const {
    data: accountsData,
    error: accountsError,
    isValidating: isValidatingAccounts,
    mutate,
  } = useSWR<{ accounts: { address: string }[] }>(session && ['/api/getAccounts']);

  const slugdata = useMemo(() => ({ slug }), [slug]);
  const {
    data: presenceData,
    error: presenceError,
    isValidating: isValidatingPresence,
    mutate: mutatePresence,
  } = useSWR<{
    hasJoinedDestination: boolean;
  }>(session && ['/api/hasJoinedDestination', slugdata]);

  const hasAddedEthereumAccount = accountsData?.accounts?.length > 0;

  const signAndAddEthereumAccount = useCallback(async () => {
    if (!provider || !account) return;
    const signature = await requestSignature(provider, account);
    await submitEthereumAccount({ account, signature });
    mutate();
  }, [account, provider, mutate]);

  const [syncing, setLoading] = useState(false);
  const [syncError, setError] = useState<Error>();
  const enter = useCallback(async () => {
    setError(undefined);
    setLoading(true);
    try {
      await doSync({ slug });
      mutatePresence();
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [mutatePresence, slug]);

  const error = accountsError ?? presenceError ?? syncError;

  function renderPrimaryAction() {
    if (!session) {
      return (
        <Button
          onClick={() => signIn('discord')}
          disabled={loadingSession}
          loading={loadingSession}
        >
          Sign in with Discord
        </Button>
      );
    }

    if (!hasAddedEthereumAccount) {
      if (!account) {
        return <Button onClick={() => connect(WALLET_CONNECT_OPTIONS)}>Connect Wallet</Button>;
      }

      return <Button onClick={signAndAddEthereumAccount}>Verify your Address</Button>;
    }

    if (presenceData?.hasJoinedDestination) {
      return (
        <div>
          <Paragraph css={{ textAlign: 'center' }}>You&apos;re in! Check Discord 👀</Paragraph>
          <Button onClick={enter} loading={syncing} disabled={syncing}>
            Refresh your Roles
          </Button>
        </div>
      );
    }

    return (
      <Button onClick={enter} loading={isValidatingPresence}>
        Verify Loot to Enter
      </Button>
    );
  }

  return (
    <Box
      css={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        p: '$4',
      }}
    >
      <Box css={{ col: true, sy: '$8' }}>
        <Title css={{ textAlign: 'center' }}>{title}</Title>
        <Paragraph css={{ color: 'gray', textAlign: 'center' }}>
          Join the {title} Discord.
        </Paragraph>
      </Box>

      {error && <ErrorText>{error.message}</ErrorText>}

      <Box css={{ col: true, sy: '$2' }}>{renderPrimaryAction()}</Box>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps<
  ComponentPropsWithoutRef<typeof JoinPage>,
  { slug: string }
> = async (ctx) => {
  ctx.res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59');

  const { slug } = ctx.params;

  if (!AllCollections[slug]) return { notFound: true };

  if (slug === 'katana') return { props: { title: 'Katana Garden' } };
  if (slug === 'upgrade') return { props: { title: 'Upgrade Materials' } };

  return { props: { title: 'How did you get here?' } };
};

export default JoinPage;
