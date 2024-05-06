/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: Env;
}

interface Document {
  startViewTransition(cb: () => void): void;
}
