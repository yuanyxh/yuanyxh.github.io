import { parse, stringify } from 'qs';
import { cloneDeep, isEqual } from 'lodash-es';

import { addGlobalListener } from '@/utils';
import EventEmitter from '@/utils/event';

import type { AbstractHistory } from './history';
import History from './history';
import RouteTree from './route-tree';

/** component module */
interface ComponentModule {
  default(props?: any): React.ReactNode;
  [key: string]: unknown;
}

/** lazy load component module */
type LazyComponent = (props?: any) => Promise<ComponentModule>;

/** meta data in route */
interface Meta {
  title: string;
  date: string;
  author: string;
  description: string;
  imageUrl: string;
  book?: boolean;
  draft?: boolean;
}

/** user route */
interface RouteObject {
  path: string;
  id?: string;
  element?: React.ReactNode | LazyComponent;
  children?: RouteObject[];
  meta?: Meta;
  module?: PageModule;
}

/** resolve route */
interface ResolveRouteObject extends RouteObject {
  fullPath: string;
  children?: ResolveRouteObject[];
}

/** current route state */
interface RouteState {
  path: string;
  hash: string;
  state: any;
  query?: Record<string, string | string[] | undefined>;
  meta?: Meta;
}

/** route changed listener */
type RouterListener = (state: RouteState) => void;
/** route changed unlistener */
type RouterUnListener = () => void;

/** navigate route options */
interface NavigateOptions extends Partial<Pick<RouteState, 'query' | 'hash' | 'state'>> {
  replace?: boolean;
}

/** page Module */
interface PageModule {
  status: 'pending' | 'fulfilled' | 'rejected';
  module?: ComponentModule;
  error?: Error;
}

/** router event define */
const EventKeys = {
  BEFORE_ENTER: 'beforeEnter',
  AFTER_ENTER: 'afterEnter'
} as const;

/** get current route state */
function getState(): RouteState {
  return {
    path: window.location.pathname as string,
    query: parse(window.location.search.slice(1)) as RouteState['query'],
    hash: window.location.hash,
    state: null
  };
}

/**
 *
 * @description resolve fullpath with route path
 * @param routes
 * @param parent
 * @returns
 */
function resolveFullPath(routes: RouteObject[], parent: string): ResolveRouteObject[] {
  return routes.map(function map(route) {
    const seps = parent.split('/');
    seps.shift();

    const _route = route as ResolveRouteObject;

    _route.fullPath = [...seps, route.path].join('/');

    if (!_route.fullPath.startsWith('/')) {
      _route.fullPath = '/' + _route.fullPath;
    }

    if (route.children?.length) {
      resolveFullPath(route.children, _route.fullPath);
    }

    return _route;
  });
}

/**
 *
 * @description request lazy component module
 * @param match
 * @returns
 */
async function fetch(match: RouteObject) {
  if (match.module && match.module.status === 'fulfilled') {
    return match.module.module!;
  }

  if (!match.element) {
    return {
      default() {
        return null;
      }
    };
  }

  if (typeof match.element === 'function') {
    return await match.element();
  }

  return {
    default() {
      return match.element as React.ReactNode;
    }
  };
}

/**
 *
 * @description resolve all page with resolved route
 * @param matchs
 * @param cb
 * @returns
 */
async function resolveComponents(
  matchs: ResolveRouteObject[],
  cb: (data: ResolveRouteObject[]) => any
) {
  const awaits = matchs.map(fetch);

  const safeMatchs: ResolveRouteObject[] = cloneDeep(matchs).map(
    (safeMatch: ResolveRouteObject) => {
      return {
        ...safeMatch,
        module:
          safeMatch.module && safeMatch.module.status === 'fulfilled'
            ? safeMatch.module
            : { status: 'pending' }
      };
    }
  );

  return Promise.all(
    awaits.map((p, i) => {
      return new Promise((resolve) => {
        p.then((value) => {
          const module: PageModule = {
            status: 'fulfilled',
            module: value
          };

          safeMatchs[i] = {
            ...safeMatchs[i],
            module: module
          };

          matchs[i].module = module;

          cb(safeMatchs);
        })
          .catch((error) => {
            safeMatchs[i] = {
              ...safeMatchs[i],
              module: {
                status: 'rejected',
                error: error
              }
            };

            cb(safeMatchs);
          })
          .finally(() => {
            resolve('any');
          });
      });
    })
  );
}

/** 404 not found path define */
export const NOT_FOUND_PATH = 'NOT_FOUND_PATH';
/** index page define */
export const INDEX_PATH = 'index';

/** 404 not found error */
export class NotFound extends Error {
  name = 'NotFound';

  status = 404;

  constructor(message?: string) {
    super(message || 'not found');
  }
}

/** router class, app route point manager */
class Router {
  private routes: ResolveRouteObject[] = [];

  private routeTree: RouteTree;

  private history: AbstractHistory;
  private event: EventEmitter = new EventEmitter();

  private state: RouteState | undefined;

  private listeners: Map<RouterListener, RouterUnListener> = new Map();

  private markObsolete: (() => void) | undefined;

  constructor(routes: RouteObject[], { history }: { history: AbstractHistory }) {
    this.routes = cloneDeep(resolveFullPath(routes, ''));
    this.routeTree = new RouteTree(cloneDeep(this.routes));

    this.history = history;
    this.history.setRouter(this);

    addGlobalListener('popstate', () => {
      const state = getState();
      this.navigateTo(state.path, state);
    });

    addGlobalListener('hashchange', () => {
      try {
        window.document.getElementById(window.location.hash.slice(1))?.scrollIntoView();
      } catch (_err) {
        /* empty */
      }
    });
  }

  private change(state: RouteState) {
    for (const listener of this.listeners.keys()) {
      listener(cloneDeep(state));
    }
  }

  private navigateTo(to: number): boolean;
  private navigateTo(to: string, options?: NavigateOptions, changeHistory?: boolean): boolean;
  private navigateTo(to: number | string, options?: NavigateOptions, changeHistory = false) {
    if (typeof to === 'number') {
      return this.history.go(to);
    }

    try {
      // hash changes
      if (to.startsWith('#')) {
        options = { ...this.state, hash: to, replace: true };
        to = this.state?.path || '/';
      }

      const _matchs = this.routeTree.match(to);

      const newState: RouteState = {
        path: to,
        query: options?.query || {},
        hash: options?.hash || '',
        state: options?.state || null
      };

      if (_matchs[_matchs.length - 1]?.meta) {
        newState.meta = _matchs[_matchs.length - 1].meta;
      }

      const isSome = isEqual(this.state, newState);
      if (changeHistory && isSome) {
        return false;
      }

      // cancel last update
      if (this.markObsolete) {
        this.markObsolete();
        this.markObsolete = void 0;
      }

      const fromState = this.state;
      this.state = newState;
      const toState = cloneDeep(this.state);

      const method = options?.replace ? 'replace' : 'push';

      if (!isSome) {
        this.change(toState);
      }

      if (fromState?.path !== toState.path) {
        this.event.emit(EventKeys.BEFORE_ENTER, fromState, toState, {
          type: method,
          changeHistory
        });
      }

      // We don't want stale requests
      let isObsolete = false;
      this.markObsolete = () => {
        isObsolete = true;
        this.event.emit(EventKeys.AFTER_ENTER, fromState, toState, method);
      };

      // We want requests to go out simultaneously, but updates to be sequential
      let normalIndex = 0;
      resolveComponents(_matchs, (matchs: ResolveRouteObject[]) => {
        if (!isObsolete) {
          const completed = matchs.findIndex((match) => match.module?.status === 'fulfilled');

          if (completed === normalIndex) {
            normalIndex++;
          } else if (completed > normalIndex) {
            return;
          }

          const safeMatchs = cloneDeep(matchs);
          const getMatch = () => safeMatchs.shift();
          this.event.emit('matchRoute', getMatch);
        }
      }).finally(() => {
        if (!isObsolete) {
          this.event.emit(EventKeys.AFTER_ENTER, fromState, toState, method);
        }
      });

      if (changeHistory) {
        const query = stringify(options?.query);
        const hash = options?.hash
          ? options.hash[0] === '#'
            ? options.hash
            : '#' + options.hash
          : '';

        this.history[method](to + (query ? '?' + query : '') + hash, options?.state);
      }

      return true;
    } catch (err) {
      this.event.emit(EventKeys.AFTER_ENTER);

      console.error(err);

      return false;
    }
  }

  initialize() {
    const state = getState();
    this.navigateTo(state.path, state);
  }

  onMatchRoute(cb: (getMatch: () => ResolveRouteObject | undefined) => any) {
    const cancel = this.event.on('matchRoute', cb);

    return cancel;
  }

  subscribe(listener: RouterListener) {
    if (this.listeners.has(listener)) {
      return this.listeners.get(listener)!;
    }

    const unListener = () => this.listeners.delete(listener);
    this.listeners.set(listener, unListener);

    return unListener;
  }

  [EventKeys.BEFORE_ENTER](
    fn: (
      from: RouteState,
      to: RouteState,
      { type, changeHistory }: { type: 'replace' | 'push'; changeHistory: boolean }
    ) => any
  ) {
    return this.event.on(EventKeys.BEFORE_ENTER, fn);
  }

  [EventKeys.AFTER_ENTER](
    fn: (
      from: RouteState,
      to: RouteState,
      { type, changeHistory }: { type: 'replace' | 'push'; changeHistory: boolean }
    ) => any
  ) {
    return this.event.on(EventKeys.AFTER_ENTER, fn);
  }

  navigate(to: number): boolean;
  navigate(to: string, options?: NavigateOptions): boolean;
  navigate(to: number | string, options?: NavigateOptions) {
    if (typeof to === 'number') return this.navigateTo(to);
    else return this.navigateTo(to, options, true);
  }

  getRoutes() {
    return cloneDeep(this.routes);
  }

  getState() {
    return cloneDeep(this.state);
  }
}

export function createRouter(routes: RouteObject[]) {
  return new Router(routes, { history: new History() });
}

export default Router;

export type {
  ComponentModule,
  LazyComponent,
  NavigateOptions,
  PageModule,
  ResolveRouteObject,
  RouteObject,
  RouterListener,
  RouterUnListener,
  RouteState
};
