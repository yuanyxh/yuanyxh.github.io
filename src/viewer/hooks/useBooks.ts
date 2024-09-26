import { useMemo } from 'react';

import { getChildrenById, useRoutes } from '@/router';

export const Books_ID = 'Books';

export function useBooks() {
  const routes = useRoutes();

  const books = useMemo(() => {
    let books = getChildrenById(routes, Books_ID);

    // Don't show drafts in production
    books = books.filter((book) => (import.meta.env.PROD ? !book.meta!.draft : true));

    // the latest books are displayed first
    books.sort((a, b) => new Date(b.meta!.date).getTime() - new Date(a.meta!.date).getTime());

    return books;
  }, [routes]);

  return books;
}
