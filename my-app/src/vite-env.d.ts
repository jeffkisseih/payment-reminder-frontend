/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // add other VITE_... vars here if you use them
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

