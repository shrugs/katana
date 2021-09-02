import React, { useCallback } from 'react';
import { useWallet } from '@gimmixorg/use-wallet';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Head from 'next/head';
import { signIn, useSession } from 'next-auth/client';
import type { ICoreOptions } from 'web3modal';
import { requestSignature } from '@lib/client/requestSignature';
import { styled } from 'stitches.config';
import useSWR from 'swr';

const Button = styled('button', {
  marginTop: '20px',
  border: 'none',
  outline: 'none',
  color: 'white',
  fontFamily: '$serif',
  fontSize: '18px',
  cursor: 'pointer',
  backgroundColor: 'hsl(203, 18%, 19%)',
  textDecoration: 'none',
  padding: '10px 20px',
  borderRadius: '5px',
});

const HEADERS = { Accept: 'application/json' };

const WALLET_CONNECT_OPTIONS: Partial<ICoreOptions> = {
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: 'b95f6330bfdd4f5d8960db9d1d3da676',
      },
    },
  },
  theme: 'dark',
};

function submitEnterDiscord() {
  return fetch('/api/verify', { method: 'POST' });
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

const IndexPage = () => {
  const [session, loadingSession] = useSession();
  const { connect, provider, account } = useWallet();

  const { data, error, isValidating, mutate } = useSWR<{ accounts: { address: string }[] }>(
    session && ['/api/getAccounts'],
  );

  const {
    data: presenceData,
    error: presenceError,
    mutate: mutatePresence,
  } = useSWR<{
    hasJoinedDestination: boolean;
  }>(session && ['/api/hasJoinedDestination']);

  const hasAddedEthereumAccount = data?.accounts?.length > 0;

  const signAndAddEthereumAccount = useCallback(async () => {
    if (!provider || !account) return;
    const signature = await requestSignature(provider, account);
    await submitEthereumAccount({ account, signature });
    mutate();
  }, [account, provider, mutate]);

  const enter = useCallback(async () => {
    await submitEnterDiscord();
    mutatePresence();
  }, [mutatePresence]);

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
          <div>You are in the katana garden, check discord.</div>
          <Button onClick={enter}>Refresh your Katana Roles</Button>
        </div>
      );
    }

    return <Button onClick={enter}>Verify Katanas to Enter the Garden</Button>;
  }

  return (
    <div className="index">
      <Head>
        <title>Katana Garden</title>
      </Head>
      <h1>Katana Garden</h1>

      <div className="message">You must have a Katana to enter.</div>

      {renderPrimaryAction()}

      <div className="links">
        <a href="https://weeb.market/" target="_blank" rel="noreferrer">
          Find Katanas for sale and check prices at weeb.market.
        </a>
      </div>
      <style jsx>{`
        .index {
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }
        .message {
          margin-top: 20px;
          opacity: 0.5;
        }

        h1 {
          font-size: 32px;
          margin: 0;
          padding: 0;
          font-weight: normal;
        }
        button {
          margin-top: 20px;
          background-color: transparent;
          border: none;
          outline: none;
          color: white;
          font-family: serif;
          padding: 0;
          font-size: 18px;
          cursor: pointer;
          background-color: hsl(203, 18%, 19%);
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 5px;
        }
        .links {
          position: fixed;
          bottom: 0;
          padding: 20px 75px;
          text-align: center;
          line-height: 1.3em;
        }
      `}</style>
    </div>
  );
};

export default IndexPage;
