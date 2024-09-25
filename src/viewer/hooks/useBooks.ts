import { useMemo } from 'react';

import { getChildrenById, useRoutes } from '@/router';

export const Books_ID = 'Books';

export function useBooks() {
  const routes = useRoutes();

  const books = useMemo(() => {
    const books = getChildrenById(routes, Books_ID);

    // the latest books are displayed first
    books
      .filter((book) => !book.meta!.draft)
      .sort((a, b) => new Date(b.meta!.date).getTime() - new Date(a.meta!.date).getTime());

    return books;
  }, [routes]);

  return books;
}
