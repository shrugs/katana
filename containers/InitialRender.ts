import { useEffect, useState } from 'react';
import { createContainer } from 'unstated-next';

function useInitialRender() {
  const [isInitialRender, setIsInitialRender] = useState(true);
  useEffect(() => {
    setIsInitialRender(false);
  }, []);

  return isInitialRender;
}

export const InitialRender = createContainer(useInitialRender);
