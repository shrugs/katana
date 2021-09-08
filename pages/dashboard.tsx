import { Box } from '@elements/Box';
import { useWallet } from '@gimmixorg/use-wallet';
import { SIGNATURE_TEXT } from '@lib/constants';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { signIn, signOut, useSession } from 'next-auth/client';
import { useCallback } from 'react';

function submitEthereumAccount(body: { account: string; signature: string }) {
  return fetch('/api/addEthereumAccount', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

function Dashboard() {
  const [session, loading] = useSession();

  const { provider, account, connect } = useWallet();

  const canRequestSignature = !!account;
  const requestSignature = useCallback(async () => {
    if (!provider || !account) return;
    const signature = await provider.send('personal_sign', [SIGNATURE_TEXT, account]);
    await submitEthereumAccount({ account, signature });
  }, [account, provider]);

  return (
    <Box css={{ display: 'flex', flexDirection: 'column', sy: '$4' }}>
      {!session && (
        <>
          Not signed in <br />
          <button onClick={() => signIn('discord')}>Sign in</button>
        </>
      )}
      {session && (
        <>
          Signed in as {session.user?.email} {JSON.stringify(session)} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )}

      {!account && (
        <button
          onClick={() =>
            connect({
              providerOptions: {
                walletconnect: {
                  package: WalletConnectProvider,
                  options: { infuraId: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID },
                },
              },
            })
          }
        >
          {' '}
          connect to web3
        </button>
      )}

      <button onClick={() => requestSignature()} disabled={!canRequestSignature}>
        link ethereum address
      </button>
    </Box>
  );
}

export default Dashboard;
