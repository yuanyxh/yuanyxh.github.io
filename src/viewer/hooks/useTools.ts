import { useMemo } from 'react';

import { getChildrenById, useRoutes } from '@/router';

export const Tools_ID = 'Tools';

export function useTools() {
  const routes = useRoutes();

  const tools = useMemo(() => {
    const tools = getChildrenById(routes, Tools_ID);

    // the latest tools are displayed first
    tools.sort((a, b) => new Date(b.meta!.date).getTime() - new Date(a.meta!.date).getTime());

    return tools;
  }, [routes]);

  return tools;
}
