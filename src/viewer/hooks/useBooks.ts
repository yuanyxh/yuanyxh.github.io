import { useMemo } from 'react';

import { useRoutes } from '@/router';
import { INDEX_PATH } from '@/router';

export function useBooks() {
  const routes = useRoutes();

  const books = useMemo(() => {
    // TODO: hardcode? maby use context to provide books, and router get context provide page route.
    const books = (routes?.[0].children?.[2].children || []).filter(
      ({ path }) => path !== INDEX_PATH
    );

    // the latest books are displayed first
    books.sort((a, b) => new Date(b.meta!.date).getTime() - new Date(a.meta!.date).getTime());

    return books;
  }, [routes]);

  return books;
}
