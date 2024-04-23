import { generateSW } from 'rollup-plugin-workbox';

// TODO: this is an externally defined type, just to resolve the error
export interface ExtendableEvent {}

export interface ManifestEntry {
  integrity?: string;
  revision: string | null;
  url: string;
}

export interface ManifestTransformResult {
  manifest: Array<
    ManifestEntry & {
      size: number;
    }
  >;
  warnings?: Array<string>;
}
export type ManifestTransform = (
  manifestEntries: Array<
    ManifestEntry & {
      size: number;
    }
  >,
  compilation?: unknown
) => Promise<ManifestTransformResult> | ManifestTransformResult;

export interface MapLikeObject {
  [key: string]: any;
}

export type StrategyName =
  | 'CacheFirst'
  | 'CacheOnly'
  | 'NetworkFirst'
  | 'NetworkOnly'
  | 'StaleWhileRevalidate';

export declare interface RouteHandlerCallbackOptions {
  event: ExtendableEvent;
  request: Request;
  url: URL;
  params?: string[] | MapLikeObject;
}

export interface RouteHandlerCallback {
  (options: RouteHandlerCallbackOptions): Promise<Response>;
}

export interface RouteHandlerObject {
  handle: RouteHandlerCallback;
}

interface OnSyncCallbackOptions {
  queue: Queue;
}
interface OnSyncCallback {
  (options: OnSyncCallbackOptions): void | Promise<void>;
}
export interface QueueOptions {
  forceSyncFallback?: boolean;
  maxRetentionTime?: number;
  onSync?: OnSyncCallback;
}
interface QueueEntry {
  request: Request;
  timestamp?: number;
  metadata?: object;
}

declare class Queue {
  private readonly _name;
  private readonly _onSync;
  private readonly _maxRetentionTime;
  private readonly _queueStore;
  private readonly _forceSyncFallback;
  private _syncInProgress;
  private _requestsAddedDuringSync;

  constructor(
    name: string,
    { forceSyncFallback, onSync, maxRetentionTime }?: QueueOptions
  );

  get name(): string;

  pushRequest(entry: QueueEntry): Promise<void>;

  unshiftRequest(entry: QueueEntry): Promise<void>;

  popRequest(): Promise<QueueEntry | undefined>;

  shiftRequest(): Promise<QueueEntry | undefined>;

  getAll(): Promise<Array<QueueEntry>>;

  size(): Promise<number>;

  _addRequest(
    { request, metadata, timestamp }: QueueEntry,
    operation: 'push' | 'unshift'
  ): Promise<void>;

  _removeRequest(operation: 'pop' | 'shift'): Promise<QueueEntry | undefined>;

  replayRequests(): Promise<void>;

  registerSync(): Promise<void>;

  private _addSyncListener;

  static get _queueNames(): Set<string>;
}

export type RouteHandler = RouteHandlerCallback | RouteHandlerObject;

export type HTTPMethod = 'DELETE' | 'GET' | 'HEAD' | 'PATCH' | 'POST' | 'PUT';

export type PluginState = MapLikeObject;

export interface CacheDidUpdateCallbackParam {
  cacheName: string;
  newResponse: Response;
  request: Request;
  event: ExtendableEvent;
  oldResponse?: Response | null;
  state?: PluginState;
}

export interface BroadcastCacheUpdateOptions {
  headersToCheck?: string[];
  generatePayload?: (
    options: CacheDidUpdateCallbackParam
  ) => Record<string, any>;
  notifyAllClients?: boolean;
}

export interface CacheableResponseOptions {
  statuses?: number[];
  headers?: {
    [headerName: string]: string;
  };
}

interface CacheQueryOptions {
  ignoreMethod?: boolean;
  ignoreSearch?: boolean;
  ignoreVary?: boolean;
}

export interface ExpirationPluginOptions {
  maxEntries?: number;
  maxAgeSeconds?: number;
  matchOptions?: CacheQueryOptions;
  purgeOnQuotaError?: boolean;
}

export interface CacheDidUpdateCallbackParam {
  cacheName: string;
  newResponse: Response;
  request: Request;
  event: ExtendableEvent;
  oldResponse?: Response | null;
  state?: PluginState;
}
export interface CacheDidUpdateCallback {
  (param: CacheDidUpdateCallbackParam): Promise<void | null | undefined>;
}

export interface CachedResponseWillBeUsedCallbackParam {
  cacheName: string;
  request: Request;
  cachedResponse?: Response;
  event: ExtendableEvent;
  matchOptions?: CacheQueryOptions;
  state?: PluginState;
}
export interface CachedResponseWillBeUsedCallback {
  (
    param: CachedResponseWillBeUsedCallbackParam
  ): Promise<Response | void | null | undefined>;
}

export interface CacheKeyWillBeUsedCallbackParam {
  mode: string;
  request: Request;
  event: ExtendableEvent;
  params?: any;
  state?: PluginState;
}
export interface CacheKeyWillBeUsedCallback {
  (param: CacheKeyWillBeUsedCallbackParam): Promise<Request | string>;
}

export interface CacheWillUpdateCallbackParam {
  request: Request;
  response: Response;
  event: ExtendableEvent;
  state?: PluginState;
}
export interface CacheWillUpdateCallback {
  (
    param: CacheWillUpdateCallbackParam
  ): Promise<Response | void | null | undefined>;
}
export interface CachedResponseWillBeUsedCallbackParam {
  cacheName: string;
  request: Request;
  cachedResponse?: Response;
  event: ExtendableEvent;
  matchOptions?: CacheQueryOptions;
  state?: PluginState;
}
export interface CachedResponseWillBeUsedCallback {
  (
    param: CachedResponseWillBeUsedCallbackParam
  ): Promise<Response | void | null | undefined>;
}
export interface FetchDidFailCallbackParam {
  error: Error;
  originalRequest: Request;
  request: Request;
  event: ExtendableEvent;
  state?: PluginState;
}
export interface FetchDidFailCallback {
  (param: FetchDidFailCallbackParam): Promise<void | null | undefined>;
}
export interface FetchDidSucceedCallbackParam {
  request: Request;
  response: Response;
  event: ExtendableEvent;
  state?: PluginState;
}
export interface FetchDidSucceedCallback {
  (param: FetchDidSucceedCallbackParam): Promise<Response>;
}
export interface RequestWillFetchCallbackParam {
  request: Request;
  event: ExtendableEvent;
  state?: PluginState;
}
export interface RequestWillFetchCallback {
  (param: RequestWillFetchCallbackParam): Promise<Request>;
}
export interface HandlerWillRespondCallbackParam {
  request: Request;
  response: Response;
  event: ExtendableEvent;
  state?: PluginState;
}
export interface HandlerWillRespondCallback {
  (param: HandlerWillRespondCallbackParam): Promise<Response>;
}
export interface HandlerDidErrorCallbackParam {
  request: Request;
  event: ExtendableEvent;
  error: Error;
  state?: PluginState;
}
export interface HandlerDidErrorCallback {
  (param: HandlerDidErrorCallbackParam): Promise<Response | undefined>;
}
export interface HandlerDidRespondCallbackParam {
  request: Request;
  event: ExtendableEvent;
  response?: Response;
  state?: PluginState;
}
export interface HandlerDidRespondCallback {
  (param: HandlerDidRespondCallbackParam): Promise<void | null | undefined>;
}
export interface HandlerDidCompleteCallbackParam {
  request: Request;
  error?: Error;
  event: ExtendableEvent;
  response?: Response;
  state?: PluginState;
}

export interface HandlerDidCompleteCallback {
  (param: HandlerDidCompleteCallbackParam): Promise<void | null | undefined>;
}

export interface HandlerWillStartCallbackParam {
  request: Request;
  event: ExtendableEvent;
  state?: PluginState;
}
export interface HandlerWillStartCallback {
  (param: HandlerWillStartCallbackParam): Promise<void | null | undefined>;
}

export declare interface WorkboxPlugin {
  cacheDidUpdate?: CacheDidUpdateCallback;
  cachedResponseWillBeUsed?: CachedResponseWillBeUsedCallback;
  cacheKeyWillBeUsed?: CacheKeyWillBeUsedCallback;
  cacheWillUpdate?: CacheWillUpdateCallback;
  fetchDidFail?: FetchDidFailCallback;
  fetchDidSucceed?: FetchDidSucceedCallback;
  handlerDidComplete?: HandlerDidCompleteCallback;
  handlerDidError?: HandlerDidErrorCallback;
  handlerDidRespond?: HandlerDidRespondCallback;
  handlerWillRespond?: HandlerWillRespondCallback;
  handlerWillStart?: HandlerWillStartCallback;
  requestWillFetch?: RequestWillFetchCallback;
}

export interface RuntimeCaching {
  handler: RouteHandler | StrategyName;
  method?: HTTPMethod;
  options?: {
    backgroundSync?: {
      name: string;
      options?: QueueOptions;
    };

    broadcastUpdate?: {
      channelName?: string;
      options: BroadcastCacheUpdateOptions;
    };

    cacheableResponse?: CacheableResponseOptions;

    cacheName?: string | null;

    expiration?: ExpirationPluginOptions;

    networkTimeoutSeconds?: number;

    plugins?: Array<WorkboxPlugin>;

    precacheFallback?: {
      fallbackURL: string;
    };

    rangeRequests?: boolean;

    fetchOptions?: RequestInit;

    matchOptions?: CacheQueryOptions;
  };

  urlPattern: RegExp | string | RouteMatchCallback;
}

export interface RouteMatchCallbackOptions {
  event: ExtendableEvent;
  request: Request;
  sameOrigin: boolean;
  url: URL;
}

export interface RouteMatchCallback {
  (options: RouteMatchCallbackOptions): any;
}

export interface GoogleAnalyticsInitializeOptions {
  cacheName?: string;
  parameterOverrides?: {
    [paramName: string]: string;
  };
  hitFilter?: (params: URLSearchParams) => void;
}

export default generateSW({
  swDest: './build/sw.js',
  globDirectory: './build',
  globPatterns: ['**/*.{js,css,html}'],
  babelPresetEnvTargets: [
    'Chrome >= 87',
    'Firefox >= 78',
    'Safari >= 14',
    'Edge >= 88',
    'Opera >= 80',
    'defaults and fully supports es6-module'
  ],
  cleanupOutdatedCaches: true,
  clientsClaim: true
  // sourcemap: false
});

export interface BasePartial {
  /** 要缓存的链接？ */
  additionalManifestEntries?: Array<string | ManifestEntry>;
  /** 匹配命中即缓存？ */
  dontCacheBustURLsMatching?: RegExp;
  /** 转换 manifest */
  manifestTransforms?: Array<ManifestTransform>;
  /** 允许加入缓存的最大块 */
  maximumFileSizeToCacheInBytes?: number;
  /** url 前缀 */
  modifyURLPrefix?: {
    [key: string]: string;
  };
}

export interface GlobPartial {
  /** 生成预缓存清单时是否遵循符号链接 */
  globFollow?: boolean;

  /** 忽略匹配 */
  globIgnores?: Array<string>;

  /** 匹配加入缓存 */
  globPatterns?: Array<string>;

  /** 严格模式，生成预缓存时不忽略文件目录警告 */
  globStrict?: boolean;

  templatedURLs?: {
    [key: string]: string | Array<string>;
  };
}

export interface GeneratePartial {
  /** babel 解析的目标？ */
  babelPresetEnvTargets?: Array<string>;

  cacheId?: string | null;

  /** 清理过期缓存 */
  cleanupOutdatedCaches?: boolean;

  /** Service Worker 是否应在激活后立即开始控制任何现有客户端。 */
  clientsClaim?: boolean;

  /** 如果对以 / 结尾的网址的导航请求与预缓存的网址不匹配，该值将被附加到该网址，并将检查该网址是否存在预缓存匹配。此值应该设置为 Web 服务器用于其目录索引的内容。 */
  directoryIndex?: string | null;

  disableDevLogs?: boolean;

  ignoreURLParametersMatching?: Array<RegExp>;

  importScripts?: Array<string>;

  inlineWorkboxRuntime?: boolean;

  mode?: string | null;

  navigateFallback?: string | null;

  navigateFallbackAllowlist?: Array<RegExp>;

  navigateFallbackDenylist?: Array<RegExp>;

  navigationPreload?: boolean;

  offlineGoogleAnalytics?: boolean | GoogleAnalyticsInitializeOptions;

  runtimeCaching?: Array<RuntimeCaching>;

  skipWaiting?: boolean;

  sourcemap?: boolean;
}

export interface RequiredSWDestPartial {
  swDest: string;
}

export interface OptionalGlobDirectoryPartial {
  globDirectory?: string;
}
