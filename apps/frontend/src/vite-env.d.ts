/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_PAYHERE_RETURN_URL: string;
  readonly VITE_PAYHERE_CANCEL_URL: string;
  readonly VITE_FORMSPREE_ENDPOINT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}