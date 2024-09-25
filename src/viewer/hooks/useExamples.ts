import { useMemo } from 'react';

import { getChildrenById, useRoutes } from '@/router';

export const Examples_ID = 'Examples';

export function useExamples() {
  const routes = useRoutes();

  const examples = useMemo(() => {
    const examples = getChildrenById(routes, Examples_ID);

    // the latest examples are displayed first
    examples
      .filter((example) => !example.meta!.draft)
      .sort((a, b) => new Date(b.meta!.date).getTime() - new Date(a.meta!.date).getTime());

    return examples;
  }, [routes]);

  return examples;
}
