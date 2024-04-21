import { useMemo } from 'react';

import { useRoute } from '@/router';
import { INDEX_PATH } from '@/router';

export function useArticles() {
  const routes = useRoute();

  const articles = useMemo(() => {
    // TODO: hardcode? maby use context to provide articles, and router get context provide page route.
    const articles = (routes?.[0].children?.[1].children || []).filter(
      ({ path }) => path !== INDEX_PATH
    );

    // the latest articles are displayed first
    articles.sort(
      (a, b) =>
        new Date(b.meta!.date).getTime() - new Date(a.meta!.date).getTime()
    );

    return articles;
  }, [routes]);

  return articles;
}
