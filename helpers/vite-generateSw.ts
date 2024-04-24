import type { PluginOption } from 'vite';
import { generateSW } from 'workbox-build';

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

// -------------------------------------------------

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

  /** 禁用开发 log */
  disableDevLogs?: boolean;

  /**
   * 在查找预缓存匹配项之前，系统会移除与此数组中的某个正则表达式匹配的所有搜索参数名称。
   * 如果您的用户请求的网址包含一些用于跟踪流量来源的网址参数，那么这种做法非常有用。
   * */
  ignoreURLParametersMatching?: Array<RegExp>;

  /** 导入额外脚本 */
  importScripts?: Array<string>;

  /** 将 workbox 依赖内置在生成的 service workder 文件中 */
  inlineWorkboxRuntime?: boolean;

  mode?: string | null;

  /**
   * 如果指定此参数，针对未预缓存的网址的所有导航请求都将通过所提供的网址中的 HTML 执行。
   * 您必须传入预缓存清单中列出的 HTML 文档的网址。这适用于单页应用场景，在此场景中，
   * 您希望所有导航都使用通用的 App Shell HTML。
   * */
  navigateFallback?: string | null;

  /**
   * 可选的正则表达式数组，用于限制所配置的 navigateFallback 行为适用的网址。
   * 如果只有您网站的部分网址应被视为单页应用的一部分，这种做法非常有用。
   * 如果同时配置了 navigateFallbackDenylist 和 navigateFallbackAllowlist，则拒绝名单优先。
   */
  navigateFallbackAllowlist?: Array<RegExp>;

  /**
   * 可选的正则表达式数组，用于限制所配置的 navigateFallback 行为适用的网址。
   */
  navigateFallbackDenylist?: Array<RegExp>;

  /** 启用导航预加载 */
  navigationPreload?: boolean;

  /** 控制是否支持离线 Google Analytics（分析）。 */
  offlineGoogleAnalytics?: boolean | GoogleAnalyticsInitializeOptions;

  /**
   * 指定一个或多个运行时缓存配置。
   * 系统会使用您定义的匹配和处理程序配置将这些对象转换为 workbox-routing.registerRoute 调用
   */
  runtimeCaching?: Array<RuntimeCaching>;

  /**
   * 是否将对 skipWaiting() 的无条件调用添加到生成的 Service Worker。
   * 如果为 false，则改为添加 message 监听器，以允许客户端页面通过对等待的 Service Worker
   * 调用 postMessage({type: 'SKIP_WAITING'}) 来触发 skipWaiting()。
   */
  skipWaiting?: boolean;

  sourcemap?: boolean;
}

export interface RequiredSWDestPartial {
  /** 输出 service worker 路径 */
  swDest: string;
}

export interface OptionalGlobDirectoryPartial {
  /** 指定工作目录 */
  globDirectory?: string;
}

export interface RuntimeCaching {
  /** 路由处理程序或策略名称 */
  handler: RouteHandler | StrategyName;
  /** 请求方式 */
  method?: HTTPMethod;
  options?: {
    /**
     * BackgroundSync API，自动将失败的请求加入队列，并在将来的 sync 事件触发时重试
     * 支持 BackgroundSync API 的浏览器会根据由浏览器管理的时间间隔代表您自动重放失败的请求，
     * 并且可能会在两次重放尝试之间使用指数退避算法。
     */
    backgroundSync?: {
      name: string;
      options?: QueueOptions;
    };

    /**
     * 广播更新，在数据存在更新时通知对应的广播频道，
     * https://developer.chrome.com/docs/workbox/modules/workbox-broadcast-update?hl=zh-cn
     */
    broadcastUpdate?: {
      channelName?: string;
      options: BroadcastCacheUpdateOptions;
    };

    /**
     * 在运行时缓存资源时，判断给定响应是否有效以及是否符合保存和重复使用条件。
     */
    cacheableResponse?: CacheableResponseOptions;

    /**
     * 如果提供，此属性将设置在 handler 中配置的 workbox-strategies 的 cacheName 属性。
     */
    cacheName?: string | null;

    /**
     * 设置缓存过期策略
     */
    expiration?: ExpirationPluginOptions;

    /**
     * 网络超时
     */
    networkTimeoutSeconds?: number;

    /**
     * 插件
     */
    plugins?: Array<WorkboxPlugin>;

    /** 预缓存插件 */
    precacheFallback?: {
      fallbackURL: string;
    };

    /** 范围请求插件 */
    rangeRequests?: boolean;

    /** 请求选项 */
    fetchOptions?: RequestInit;

    /** 匹配选项 */
    matchOptions?: CacheQueryOptions;
  };

  urlPattern: RegExp | string | RouteMatchCallback;
}

export interface ConfigParams {
  mode: 'production' | 'development';
}

const defaultConfig = {
  name: 'vite:workbox'
};

export default function vitePluginWorkbox({
  mode
}: ConfigParams): PluginOption {
  if (mode === 'development') {
    return defaultConfig;
  }

  const getSwConfig = () => {
    return generateSW({
      swDest: './build/sw.js',
      globDirectory: './build',
      globPatterns: ['**/**'],
      directoryIndex: 'index.html',
      babelPresetEnvTargets: [
        'Chrome >= 87',
        'Firefox >= 78',
        'Safari >= 14',
        'Edge >= 88',
        'Opera >= 80',
        'defaults and fully supports es6-module'
      ],
      cleanupOutdatedCaches: true,
      clientsClaim: true,
      mode: mode,
      runtimeCaching: [
        {
          handler: 'CacheFirst',
          urlPattern: (options) => options.request.destination === 'font',
          options: {
            cacheName: 'fontCache',
            expiration: {
              /** maximum cache 3 months */
              maxAgeSeconds: 3 * 30 * 24 * 60 * 60
            }
          }
        },
        {
          handler: 'CacheFirst',
          urlPattern: (options) => options.request.destination === 'image',
          options: {
            cacheName: 'imageCache',
            expiration: {
              /** maximum cache 3 months */
              maxAgeSeconds: 3 * 30 * 24 * 60 * 60
            }
          }
        }
      ]
      // sourcemap: false
    });
  };

  const config: PluginOption = {
    ...defaultConfig,
    apply: 'build',
    enforce: 'post',
    configResolved(config) {
      console.log(config);
    },
    async closeBundle() {
      const { warnings, count, size } = await getSwConfig();
      console.log(warnings, count, size);
    }
  };

  return config;
}
