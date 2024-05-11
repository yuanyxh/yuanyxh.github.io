/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Document {
  startViewTransition(cb: () => void): void;
}
