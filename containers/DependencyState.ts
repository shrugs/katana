import { ResultDependency } from '@lib/results/RuleResult';
import { useSession } from 'next-auth/client';
import useSWR from 'swr';
import { createContainer } from 'unstated-next';

function useDependencyState() {
  const [session] = useSession();
  const {
    data: dependencyStateData,
    error: dependencyStateError,
    isValidating: loadingDependencyState,
    mutate: refetchDependencyState,
  } = useSWR<Record<ResultDependency, boolean>, Error>(session && ['/api/getDependencyState']);

  const {
    data: ethereumAccountData,
    error: ethereumAccountError,
    isValidating: loadingEthereumAccount,
    mutate: refetchEthereumAccount,
  } = useSWR<{ hasEthereumAccount: boolean }, Error>(session && ['/api/getHasEthereumAccount']);

  return {
    errors: {
      [ResultDependency.Discord]: dependencyStateError,
      [ResultDependency.Telegram]: dependencyStateError,
      ethereum: ethereumAccountError,
    },
    loadingStates: {
      [ResultDependency.Discord]: loadingDependencyState,
      [ResultDependency.Telegram]: loadingDependencyState,
      ethereum: loadingEthereumAccount,
    },
    dependencyStates: {
      [ResultDependency.Discord]: false,
      [ResultDependency.Telegram]: false,
      ...dependencyStateData,
      ethereum: ethereumAccountData?.hasEthereumAccount ?? false,
    },
    refetchEthereumAccount,
  };
}

export const DependencyState = createContainer(useDependencyState);
