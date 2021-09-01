import '@styles/preflight.css';

import type { AppProps } from 'next/app';
import MainLayout from '@app/layouts/MainLayout';
import { Provider as NextAuthProvider } from 'next-auth/client';
import nest from '@lib/nest';
import { PropsWithChildren } from 'react';
import { SWRConfig } from 'swr';
import { fetcher } from '@lib/client/fetcher';

type KatanaAppProps = AppProps<{}>;

const Layout = nest([
  ({ children }) => <SWRConfig value={{ fetcher }}>{children}</SWRConfig>,
  ({ children, pageProps }: PropsWithChildren<Pick<KatanaAppProps, 'pageProps'>>) => (
    <NextAuthProvider session={pageProps.session}>{children}</NextAuthProvider>
  ),
  MainLayout,
]);

function App({ Component, pageProps }: KatanaAppProps) {
  return (
    <Layout pageProps={pageProps}>
      <Component {...pageProps} />
    </Layout>
  );
}

export default App;
