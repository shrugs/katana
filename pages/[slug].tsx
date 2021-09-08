import { GetServerSideProps } from 'next';
import { ComponentPropsWithoutRef, useCallback, useState } from 'react';
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

const doSync = (body: { slug: string }) => mutator<{ results: boolean[][] }>('/api/sync', body);

export function JoinPage({
  title,
  dependencies,
}: {
  title: string;
  dependencies: CollectionDependency[];
}) {
  const router = useRouter();
  const slug = router.query.slug as string;

  const [syncing, setLoading] = useState(false);
  const [syncError, setError] = useState<Error>();
  const [results, setResults] = useState<boolean[][]>();
  const sync = useCallback(async () => {
    setError(undefined);
    setLoading(true);
    try {
      const { results } = await doSync({ slug });
      setResults(results);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  const { dependencyStates } = DependencyState.useContainer();
  const fulfillsAllDependencies = dependencies.every((dep) => dependencyStates[dep]);

  const passed = results?.some((result) => result.some(Boolean));

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

      {syncError && <ErrorText>{syncError.message}</ErrorText>}

      <Box css={{ col: true, sy: '$2' }}>
        {passed && (
          <Paragraph css={{ textAlign: 'center' }}>
            You&apos;re in! Check Discord/Telegram 👀
          </Paragraph>
        )}
        <Button
          onClick={sync}
          loading={syncing}
          disabled={!fulfillsAllDependencies || syncing || passed}
        >
          {syncing ? 'Connecting' : 'Connect'} to community
        </Button>
      </Box>
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

  const dependencies: CollectionDependency[] = [
    ...uniq(
      AllCollections[slug].links
        .flatMap((link) => link.results)
        .flatMap((result) => result.getDependencies()),
    ),
    'ethereum',
  ];

  if (slug === 'katana') {
    return { props: { title: 'Katana Garden', dependencies } };
  }

  if (slug === 'upgrade') {
    return { props: { title: 'Upgrade Materials', dependencies } };
  }

  return { props: { title: 'How did you get here?', dependencies: [] } };
};

export default JoinPage;
