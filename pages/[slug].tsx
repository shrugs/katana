import { GetServerSideProps } from 'next';
import { ComponentPropsWithoutRef, useMemo, useCallback } from 'react';
import { useWallet } from '@gimmixorg/use-wallet';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { signIn, useSession } from 'next-auth/client';
import type { ICoreOptions } from 'web3modal';
import { requestSignature } from '@lib/client/requestSignature';
import useSWR from 'swr';
import { Button } from '@app/components/Button';
import { Box } from '@app/components/Box';
import { Paragraph, Title } from '@app/components/Typography';
import { useRouter } from 'next/dist/client/router';
import { AllCollections } from '@lib/collections/AllCollections';

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

function submitEnterDiscord(body: { slug: string }) {
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

  const { data, error, isValidating, mutate } = useSWR<{ accounts: { address: string }[] }>(
    session && ['/api/getAccounts'],
  );

  const slugdata = useMemo(() => ({ slug }), [slug]);
  const {
    data: presenceData,
    error: presenceError,
    mutate: mutatePresence,
  } = useSWR<{
    hasJoinedDestination: boolean;
  }>(session && ['/api/hasJoinedDestination', slugdata]);

  console.log(presenceData, presenceError);

  const hasAddedEthereumAccount = data?.accounts?.length > 0;

  const signAndAddEthereumAccount = useCallback(async () => {
    if (!provider || !account) return;
    const signature = await requestSignature(provider, account);
    await submitEthereumAccount({ account, signature });
    mutate();
  }, [account, provider, mutate]);

  const enter = useCallback(async () => {
    await submitEnterDiscord({ slug });
    mutatePresence();
  }, [mutatePresence, slug]);

  function renderPrimaryAction() {
    if (!session) return <Button onClick={() => signIn('discord')}>Sign in with Discord</Button>;
    if (!hasAddedEthereumAccount) {
      if (!account) {
        return <Button onClick={() => connect(WALLET_CONNECT_OPTIONS)}>Connect Wallet</Button>;
      }

      return <Button onClick={signAndAddEthereumAccount}>Verify your Address</Button>;
    }

    if (presenceData?.hasJoinedDestination) {
      return (
        <div>
          <div>You&apos;re in! Check discord 👀</div>
          <Button onClick={enter}>Refresh your Roles</Button>
        </div>
      );
    }

    return <Button onClick={enter}>Verify Loot to Enter</Button>;
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
          Join the {title} Community.
        </Paragraph>
      </Box>

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
