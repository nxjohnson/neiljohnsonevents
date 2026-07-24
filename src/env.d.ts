/// <reference path="../.astro/types.d.ts" />

// Build-time only vars (used by src/lib/smugmug.ts during `astro build`/`astro dev`).
// Runtime secrets (RESEND_API_KEY, CONTACT_TO_EMAIL) are read via `cloudflare:workers`
// in src/pages/api/contact.ts instead — see README for the distinction.
interface ImportMetaEnv {
  readonly SMUGMUG_API_KEY: string;
  readonly SMUGMUG_NICKNAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
