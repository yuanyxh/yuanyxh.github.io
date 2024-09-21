import { isUndefined } from 'lodash-es';

import { INDEX_PATH, type RouteObject } from './router';

export function findRoute(routes: RouteObject[] | undefined, id: string): RouteObject | undefined {
  if (isUndefined(routes) || routes.length === 0) {
    return undefined;
  }

  let result: RouteObject | undefined = undefined;

  routes.find((route) => {
    if (route.id === id) {
      result = route;

      return true;
    }

    if (!isUndefined(route.children)) {
      const fined = findRoute(route.children, id);

      if (fined) {
        result = fined;

        return true;
      }
    }

    return false;
  });

  return result;
}

export function excludeIndex(routes: RouteObject[]) {
  return (routes || []).filter((route) => route.path !== INDEX_PATH);
}

export function getChildrenById(routes: RouteObject[] | undefined, id: string) {
  return excludeIndex(findRoute(routes, id)?.children || []);
}
