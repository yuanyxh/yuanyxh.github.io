import { isUndefined } from 'lodash-es';

import type { ResolveRouteObject } from './router';
import { INDEX_PATH } from './router';

/**
 *
 * @description find route by id
 * @param routes
 * @param id
 * @returns
 */
export function findRouteById(
  routes: ResolveRouteObject[] | undefined,
  id: string
): ResolveRouteObject | undefined {
  if (isUndefined(routes) || routes.length === 0) {
    return undefined;
  }

  let result: ResolveRouteObject | undefined = undefined;

  routes.find((route) => {
    if (route.id === id) {
      result = route;

      return true;
    }

    if (!isUndefined(route.children)) {
      const fined = findRouteById(route.children, id);

      if (fined) {
        result = fined;

        return true;
      }
    }

    return false;
  });

  return result;
}

/**
 *
 * @description find route by path
 * @param routes
 * @param id
 * @returns
 */
export function findRouteByPath(
  routes: ResolveRouteObject[] | undefined,
  path: string
): ResolveRouteObject | undefined {
  if (isUndefined(routes) || routes.length === 0) {
    return undefined;
  }

  let result: ResolveRouteObject | undefined = undefined;

  routes.find((route) => {
    if (route.fullPath === path) {
      result = route;

      return true;
    }

    if (!isUndefined(route.children)) {
      const fined = findRouteByPath(route.children, path);

      if (fined) {
        result = fined;

        return true;
      }
    }

    return false;
  });

  return result;
}

/**
 *
 * @description Exclude index route from routes
 * @param routes
 * @returns
 */
export function excludeIndex(routes: ResolveRouteObject[]) {
  return (routes || []).filter((route) => route.path !== INDEX_PATH);
}

/**
 *
 * @description Find the route with the specified id, get its children and delete the index
 * @param routes
 * @param id
 * @returns
 */
export function getChildrenById(routes: ResolveRouteObject[] | undefined, id: string) {
  return excludeIndex(findRouteById(routes, id)?.children || []);
}
