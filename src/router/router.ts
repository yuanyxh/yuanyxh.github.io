import type { ParsedQs } from 'qs';
import { parse, stringify } from 'qs';
import { cloneDeep, isEqual } from 'lodash-es';

import { addGlobalListener } from '@/utils';
import EventEmitter from '@/utils/event';

import type { AbstractHistory } from './history';
import History from './history';
import RouteTree from './route-tree';

interface ComponentModule {
  default(props?: any): React.ReactNode;
  [key: string]: unknown;
}

type LazyComponent = (props?: any) => Promise<ComponentModule>;

interface Meta {
  title: string;
}

interface ArticleMeta {
  title: string;
  date: string;
  author: string;
  description: string;
  imageUrl: string;
  book?: boolean;
}

interface RouteObject {
  path: string;
  element?: React.ReactNode | LazyComponent;
  children?: RouteObject[];
  meta?: ArticleMeta;
  module?: Module;
}

interface ResolveRouteObject extends RouteObject {
  fullPath: string;
  children?: ResolveRouteObject[];
}

interface RouteState {
  path: string;
  hash: string;
  query: Record<string, string | string[] | ParsedQs | ParsedQs[] | undefined>;
  state: any;
}

type RouterListener = (state: RouteState) => void;
type RouterUnListener = () => void;

interface NavigateOptions
  extends Partial<Pick<RouteState, 'query' | 'hash' | 'state'>> {
  replace?: boolean;
}

interface Module {
  status: 'pending' | 'fulfilled' | 'rejected';
  module?: ComponentModule;
  error?: Error;
}

const EventKeys = {
  BEFORE_ENTER: 'beforeEnter',
  AFTER_ENTER: 'afterEnter'
} as const;

function getState(): RouteState {
  return {
    path: window.location.pathname as string,
    query: parse(window.location.search.slice(1)),
    hash: window.location.hash,
    state: null
  };
}

function resolveFullPath(
  routes: RouteObject[],
  parent: string
): ResolveRouteObject[] {
  return routes.map(function map(route) {
    const seps = parent.split('/');
    seps.shift();

    const _route = route as ResolveRouteObject;

    _route.fullPath = [...seps, route.path].join('/');
    !_route.fullPath.startsWith('/') &&
      (_route.fullPath = '/' + _route.fullPath);

    if (route.children?.length) {
      resolveFullPath(route.children, _route.fullPath);
    }

    return _route;
  });
}

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

async function resolveComponents(
  matchs: ResolveRouteObject[],
  cb: (data: ResolveRouteObject[]) => any
) {
  const awaits = matchs.map(fetch);

  const safeMatchs: ResolveRouteObject[] = cloneDeep(matchs).map(
    (safeMatch) => {
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
          const module: Module = {
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

export const NOT_FOUND_PATH = 'NOT_FOUND_PATH';
export const INDEX_PATH = 'index';

export class NotFound extends Error {
  name = 'NotFound';

  status = 404;

  constructor(message?: string) {
    super(message || 'not found');
  }
}

class Router {
  private routes: ResolveRouteObject[] = [];

  private routeTree: RouteTree;

  private history: AbstractHistory;
  private event: EventEmitter = new EventEmitter();

  private state: RouteState | undefined;

  private listeners: Map<RouterListener, RouterUnListener> = new Map();

  private markObsolete: (() => void) | undefined;

  constructor(
    routes: RouteObject[],
    { history }: { history: AbstractHistory }
  ) {
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
        window.document
          .getElementById(window.location.hash.slice(1))
          ?.scrollIntoView();
      } catch (err) {
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
  private navigateTo(
    to: string,
    options?: NavigateOptions,
    changeHistory?: boolean
  ): boolean;
  private navigateTo(
    to: number | string,
    options?: NavigateOptions,
    changeHistory = false
  ) {
    if (typeof to === 'number') return this.history.go(to);

    // hash changes
    if (to.startsWith('#')) {
      options = { ...this.state, hash: to, replace: true };
      to = this.state?.path || '/';
    }

    const newState = {
      path: to,
      query: options?.query || {},
      hash: options?.hash || '',
      state: options?.state || null
    };

    const isSome = isEqual(this.state, newState);
    if (changeHistory && isSome) return false;

    // cancel last update
    if (this.markObsolete) {
      this.markObsolete();
      this.markObsolete = void 0;
    }

    try {
      const fromState = this.state;
      this.state = newState;
      const toState = cloneDeep(this.state);

      const method = options?.replace ? 'replace' : 'push';

      !isSome && this.change(toState);

      if (fromState?.path !== toState.path) {
        this.event.emit(EventKeys.BEFORE_ENTER, fromState, toState, {
          type: method,
          changeHistory
        });
      }

      const _matchs = this.routeTree.match(to);

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
          const completed = matchs.findIndex(
            (match) => match.module?.status === 'fulfilled'
          );

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
        if (!isObsolete)
          this.event.emit(EventKeys.AFTER_ENTER, fromState, toState, method);
      });

      if (changeHistory) {
        const query = stringify(options?.query);
        const hash = options?.hash
          ? options.hash[0] === '#'
            ? options.hash
            : '#' + options.hash
          : '';

        this.history[method](
          to + (query ? '?' + query : '') + hash,
          options?.state
        );
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
      {
        type,
        changeHistory
      }: { type: 'replace' | 'push'; changeHistory: boolean }
    ) => any
  ) {
    return this.event.on(EventKeys.BEFORE_ENTER, fn);
  }

  [EventKeys.AFTER_ENTER](
    fn: (
      from: RouteState,
      to: RouteState,
      {
        type,
        changeHistory
      }: { type: 'replace' | 'push'; changeHistory: boolean }
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
  Meta,
  Module,
  NavigateOptions,
  ResolveRouteObject,
  RouteObject,
  RouterListener,
  RouterUnListener,
  RouteState
};
