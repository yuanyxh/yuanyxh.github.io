import { useMemo } from 'react';

import { useRoutes } from '@/router';
import { INDEX_PATH } from '@/router';

export function useExamples() {
  const routes = useRoutes();

  const examples = useMemo(() => {
    // TODO: hardcode? maby use context to provide examples, and router get context provide page route.
    const examples = (routes?.[1]?.children || []).filter(({ path }) => path !== INDEX_PATH);

    // the latest examples are displayed first
    examples.sort((a, b) => new Date(b.meta!.date).getTime() - new Date(a.meta!.date).getTime());

    return examples;
  }, [routes]);

  return examples;
}
