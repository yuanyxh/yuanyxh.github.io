import { useMemo } from 'react';

import { getChildrenById, useRoutes } from '@/router';

export const Articles_ID = 'Articles';

export function useArticles() {
  const routes = useRoutes();

  const articles = useMemo(() => {
    const articles = getChildrenById(routes, Articles_ID);

    // the latest articles are displayed first
    articles
      .filter((article) => !article.meta!.draft)
      .sort((a, b) => new Date(b.meta!.date).getTime() - new Date(a.meta!.date).getTime());

    return articles;
  }, [routes]);

  return articles;
}
