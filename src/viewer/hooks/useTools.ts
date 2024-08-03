import { useMemo } from 'react';

import { useRoutes } from '@/router';
import { INDEX_PATH } from '@/router';

export function useTools() {
  const routes = useRoutes();

  const tools = useMemo(() => {
    // TODO: hardcode? maby use context to provide tools, and router get context provide page route.
    const tools = (routes?.[0].children?.[5].children || []).filter(
      ({ path }) => path !== INDEX_PATH
    );

    // the latest tools are displayed first
    tools.sort((a, b) => new Date(b.meta!.date).getTime() - new Date(a.meta!.date).getTime());

    return tools;
  }, [routes]);

  return tools;
}
