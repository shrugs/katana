import { GetServerSideProps } from 'next';
import { ComponentPropsWithoutRef, useCallback, useMemo, useState } from 'react';
import { Button } from '@elements/Button';
import { Box } from '@elements/Box';
import { ErrorText, Paragraph, Title } from '@elements/Typography';
import { useRouter } from 'next/dist/client/router';
import { AllCollections } from '@lib/collections/AllCollections';
import { mutator } from '@lib/client/mutator';
import { uniq } from 'lodash';
import { DependencyLineItem } from 'components/DependencyLineItem';
import { DependencyState } from '@containers/DependencyState';
import { CollectionDependency } from '@lib/collections/Collection';
import prisma from '@lib/server/prisma';
import useSWR from 'swr';
import { useSubscription } from '@lib/useSubscription';

const doSync = (body: { collectionId: string }) =>
  mutator<{ results: boolean[][] }>('/api/sync', body);

export function CollectionPage({
  collectionId,
  title,
  dependencies,
}: {
  collectionId: string;
  title: string;
  dependencies: CollectionDependency[];
}) {
  const {
    isSubscribed,
    isValidating: loadingSubscription,
    error: subscriptionError,
    subscribe,
    unsubscribe,
  } = useSubscription(collectionId);

  const [syncing, setLoading] = useState(false);
  const [syncError, setError] = useState<Error>();
  const [results, setResults] = useState<boolean[][]>();
  const subscribeAndSync = useCallback(async () => {
    setError(undefined);
    setLoading(true);
    try {
      await subscribe();
      const { results } = await doSync({ collectionId });
      setResults(results);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [collectionId, subscribe]);

  const { dependencyStates } = DependencyState.useContainer();
  const fulfillsAllDependencies = dependencies.every((dep) => dependencyStates[dep]);

  const passed = results?.some((result) => result.some(Boolean));

  const error = syncError || subscriptionError;

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
        <Box css={{ col: true, sy: '$4' }}>
          <Title css={{ textAlign: 'center' }}>{title}</Title>
          <Paragraph css={{ color: 'gray', textAlign: 'center' }}>
            Join the {title} Discord.
          </Paragraph>
        </Box>

        <Box css={{ col: true, sy: '$4' }}>
          {dependencies.map((dep) => (
            <DependencyLineItem key={dep} dependency={dep} />
          ))}
        </Box>
      </Box>

      <Box css={{ col: true, sy: '$2' }}>
        {error && <ErrorText>{error.message}</ErrorText>}

        {isSubscribed ? (
          <Paragraph css={{ textAlign: 'center' }}>
            You&apos;ve subscribed to this community.
          </Paragraph>
        ) : passed ? (
          <Paragraph css={{ textAlign: 'center' }}>
            You&apos;re in! Check Discord/Telegram 👀
          </Paragraph>
        ) : null}

        <Button
          onClick={subscribeAndSync}
          loading={loadingSubscription || syncing}
          disabled={
            !fulfillsAllDependencies || loadingSubscription || syncing || passed || isSubscribed
          }
        >
          {syncing ? 'Syncing' : isSubscribed ? 'Subscribed' : 'Subscribe'} to community
          {syncing ? '...' : isSubscribed ? ' 👍' : ''}
        </Button>
      </Box>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps<
  ComponentPropsWithoutRef<typeof CollectionPage>,
  { collectionSlug: string }
> = async (ctx) => {
  ctx.res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59');

  const { collectionSlug } = ctx.params;

  const collection = await prisma.collection.findUnique({ where: { slug: collectionSlug } });
  if (!collection) return { notFound: true };

  const dependencies: CollectionDependency[] = [
    ...uniq(
      AllCollections[collection.slug].links
        .flatMap((link) => link.results)
        .flatMap((result) => result.getDependencies()),
    ),
    'ethereum',
  ];

  return {
    props: {
      collectionId: collection.id,
      title: collection.slug === 'katana' ? 'Katana Discord' : 'Upgrade Materials',
      dependencies,
    },
  };
};

export default CollectionPage;
