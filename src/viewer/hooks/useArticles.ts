import { useMemo } from 'react';

import { getChildrenById, useRoutes } from '@/router';

export const Articles_ID = 'Articles';

export function useArticles() {
  const routes = useRoutes();

  const articles = useMemo(() => {
    let articles = getChildrenById(routes, Articles_ID);

    // Don't show drafts in production
    articles = articles.filter((article) => (import.meta.env.PROD ? !article.meta?.draft : true));

    // the latest articles are displayed first
    articles.sort((a, b) => new Date(b.meta!.date).getTime() - new Date(a.meta!.date).getTime());

    return articles;
  }, [routes]);

  return articles;
}
