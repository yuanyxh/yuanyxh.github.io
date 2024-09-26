import { useMemo } from 'react';

import { getChildrenById, useRoutes } from '@/router';

export const Examples_ID = 'Examples';

export function useExamples() {
  const routes = useRoutes();

  const examples = useMemo(() => {
    let examples = getChildrenById(routes, Examples_ID);

    // Don't show drafts in production
    examples = examples.filter((example) => (import.meta.env.PROD ? !example.meta!.draft : true));

    // the latest books are displayed first
    examples.sort((a, b) => new Date(b.meta!.date).getTime() - new Date(a.meta!.date).getTime());

    return examples;
  }, [routes]);

  return examples;
}
