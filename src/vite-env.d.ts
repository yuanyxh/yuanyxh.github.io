/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 基础路径 */
  VITE_BASE_PATH: string;
  /** 初始标题 */
  VITE_APP_TITLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Document {
  startViewTransition(cb: () => void): void;
}
