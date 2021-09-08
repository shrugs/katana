import { useCallback, useMemo } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { mutator } from './client/mutator';

const doSubscribe = (body: { collectionId: string }) => mutator('/api/subscription', body);
const doUnsubscribe = (body: { collectionId: string }) =>
  mutator('/api/subscription', body, { method: 'DELETE' });

export function useSubscription(collectionId: string) {
  const { mutate } = useSWRConfig();

  const subscriptionBody = useMemo(() => ({ collectionId }), [collectionId]);
  const key = useMemo(() => ['/api/subscription', subscriptionBody], [subscriptionBody]);

  const { data, error, isValidating } = useSWR<{ subscription: { id: string } }, Error>(
    collectionId && key,
  );

  const isSubscribed = !!data?.subscription;

  const subscribe = useCallback(
    () => mutate(key, doSubscribe(subscriptionBody), false),
    [key, mutate, subscriptionBody],
  );

  const unsubscribe = useCallback(async () => {
    mutate(key, { subscription: null }, false);
    await doUnsubscribe({ collectionId });
    mutate(key);
  }, [collectionId, key, mutate]);

  return { isSubscribed, error, isValidating, subscribe, unsubscribe };
}
