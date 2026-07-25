# Launch checklist

## SmugMug
- [x] Apply for an API key: https://api.smugmug.com/api/developer/apply
- [x] Confirm Weddings / Events / Headshots galleries are set to **public**
- [x] Find each album's `AlbumKey` and fill in `src/config/galleries.ts`
- [x] Set `SMUGMUG_API_KEY` and `SMUGMUG_NICKNAME` in `.env` (copy from `.env.example`)
- [ ] Set the same two as Cloudflare Pages **build** environment variables once deployed

## Content
- [x] Replace placeholder bio in `src/pages/about.astro` with real copy
- [x] Double check homepage/testimonial copy in `src/pages/index.astro` matches what you want live

## Resend (contact form)
- [x] Create a Resend account: https://resend.com
- [ ] Verify a sending domain (needs DNS on Cloudflare first — see below)
- [ ] Update the `from` address in `src/pages/api/contact.ts` once domain is verified
- [ ] Set `RESEND_API_KEY` and `CONTACT_TO_EMAIL` in `.dev.vars` (copy from `.dev.vars.example`)
- [ ] Set the same two as Cloudflare Pages **runtime** secrets once deployed
- [ ] Test the form end-to-end with `npm run build && npx wrangler dev`

## Cloudflare Pages deploy
- [ ] Create a Pages project connected to `nxjohnson/neiljohnsonevents`
- [ ] Build command `npm run build`, output directory `dist`
- [ ] Add build env vars + runtime secrets (see above)
- [ ] Verify the site on the `*.pages.dev` URL
- [ ] Create a deploy hook, bookmark it — hit it after adding new SmugMug photos to rebuild
- [ ] Point `neiljohnsonevents.com` DNS at Cloudflare, add as custom domain in Pages
- [ ] Confirm HTTPS + custom domain work, then cancel Squarespace

## SEO
- [ ] Submit sitemap (`/sitemap-index.xml`) in Google Search Console after DNS cutover
- [ ] Claim/fill out Google Business Profile (service areas: LA County + Orange County)
- [ ] Keep name/address/phone consistent everywhere the business is listed
- [ ] Pick up a few local backlinks (venues, vendor directories)
