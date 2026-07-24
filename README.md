# Neil Johnson Events — Portfolio Site

Astro + Tailwind photography portfolio, image data from the SmugMug API, hosted on Cloudflare
Pages. Mobile-first throughout.

## Stack

- **Astro** (static output; only the contact form is server-rendered)
- **Tailwind CSS v4**
- **SmugMug API v2** — photos fetched at **build time** (API key only, no OAuth, since the
  galleries are public)
- **Cloudflare Pages** (via `@astrojs/cloudflare`, "Workers with static assets" format)
- **Resend** — sends contact form emails from a small server route

## Project structure

```
src/
  components/       Nav, Footer, Seo, SmugMugImage, Gallery
  config/
    galleries.ts    category -> SmugMug album key mapping (fill in albumKey values)
    seo.ts           service x location matrix for SEO landing pages
  lib/smugmug.ts     build-time SmugMug fetch + responsive image helpers
  layouts/BaseLayout.astro
  pages/
    index.astro, about.astro, contact.astro
    portfolio/[category].astro          -> /portfolio/weddings|events|headshots
    [service]/[location].astro          -> /wedding-photographer/orange-county etc.
    api/contact.ts                      -> POST endpoint, prerender = false
```

## Two kinds of environment variables — don't mix these up

**Build-time** (used by `src/lib/smugmug.ts` while running `astro build`/`astro dev`, read via
`import.meta.env`):

- `SMUGMUG_API_KEY`
- `SMUGMUG_NICKNAME`

Set locally in a `.env` file (copy `.env.example`). In Cloudflare Pages, set these as **Build**
environment variables in the dashboard (Settings → Environment variables) so they're available
during the build step.

**Runtime secrets** (used only by `src/pages/api/contact.ts`, read via `cloudflare:workers`'s
`env`, not `import.meta.env`):

- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`

Set locally in a `.dev.vars` file (copy `.dev.vars.example`) — this is the Wrangler/Cloudflare
convention, separate from `.env`. In Cloudflare Pages, add these as **Runtime** secrets/variables
so the deployed contact form can read them at request time.

Both `.env` and `.dev.vars` are gitignored — never commit real keys.

## Setup

1. `npm install`
2. Copy `.env.example` → `.env` and `.dev.vars.example` → `.dev.vars`, fill in real values once
   you have them (see prerequisites below).
3. `npm run dev` → http://localhost:4321

### Prerequisites to get real data flowing

**SmugMug:**
1. Apply for an API key: https://api.smugmug.com/api/developer/apply
2. Confirm your Weddings / Events / Headshots galleries are set to **public**.
3. Find each album's key (visible in the album's API response or URL) and fill in
   `albumKey` for each category in `src/config/galleries.ts`.
4. Set `SMUGMUG_API_KEY` and `SMUGMUG_NICKNAME` (your SmugMug account nickname) in `.env`.

Until these are filled in, the site still builds — galleries just render a "coming soon"
placeholder instead of erroring.

**Resend (contact form):**
1. Create an account at https://resend.com
2. For local testing before domain verification, you can send from Resend's sandbox address —
   see the `from` field in `src/pages/api/contact.ts` (currently set to
   `contact@neiljohnsonevents.com`, which requires domain verification in Resend first).
3. Verify your sending domain in Resend once DNS is on Cloudflare (see deploy steps below).
4. Set `RESEND_API_KEY` and `CONTACT_TO_EMAIL` (the inbox that should receive inquiries) in
   `.dev.vars`.

### Testing the contact form locally against the real Cloudflare runtime

`npm run dev` (Vite/Astro dev server) does **not** load `.dev.vars` or emulate Workers bindings.
To test `/api/contact` for real:

```sh
npm run build
npx wrangler dev
```

This serves the full built site (static pages + the contact API route) at
http://localhost:8788 with `.dev.vars` loaded.

## Deploying to Cloudflare Pages

1. Push this repo to GitHub (already connected as `origin`).
2. In the Cloudflare dashboard, create a Pages project connected to the GitHub repo.
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
3. Add environment variables in the Pages project settings:
   - Build vars: `SMUGMUG_API_KEY`, `SMUGMUG_NICKNAME`
   - Runtime secrets: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`
4. Deploy. Verify the site on the `*.pages.dev` URL before touching DNS.
5. Create a **deploy hook** (Pages project → Settings → Builds & deployments → Deploy hooks) and
   bookmark the URL — hit it (or curl it) any time you add photos in SmugMug to rebuild the site
   and pick up the new images. Optionally set up a Cloudflare Cron Trigger to hit the hook nightly.
6. Once verified, point `neiljohnsonevents.com` DNS at Cloudflare and add it as a custom domain in
   the Pages project. Keep Squarespace live until the cutover is confirmed working, then cancel it.

## SEO

- `src/components/Seo.astro` centralizes title/description/canonical/OG/Twitter/JSON-LD for every
  page — pass `title`, `description`, and an optional `schema` object from each page.
- `src/config/seo.ts` drives 8 service×location landing pages (e.g.
  `/wedding-photographer/orange-county`) targeting realistic long-tail search terms that ladder up
  to the competitive head terms (Wedding Photographer, Corporate Event Photographer, Conference
  Photographer, Headshot Photographer × Los Angeles County, Orange County).
- Sitemap is auto-generated at `/sitemap-index.xml` (via `@astrojs/sitemap`); `public/robots.txt`
  points to it.
- **Off-site work that matters just as much as the code**: claim and fully fill out a **Google
  Business Profile** for the business (service areas: LA County + Orange County), keep your name/
  address/phone consistent everywhere it's listed, and pick up a few local backlinks (vendor
  directories, venues you've shot at, etc.). The head keywords won't rank from on-page work alone.
- After DNS cutover, submit the sitemap in Google Search Console.

## Notes

- `src/pages/about.astro` currently has placeholder bio copy — replace with your real bio.
- No print/e-commerce cart — removed by design for this rebuild.
- Lightbox on gallery images is a small dependency-free `<dialog>` + vanilla JS, not a separate
  package.
