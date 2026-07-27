# Site Parity — 1:1 Clone Checklist

Goal: make the rebuilt site match the original **https://www.neiljohnsonevents.com/** page-for-page.

Working page by page. **Footer is intentionally excluded** — the repo's current footer is
preferred over the original.

Legend: ☐ = to do · ✅ = done

---

## Global / Navigation (applies to every page)

File: [Nav.astro](src/components/Nav.astro)

**Decisions locked in:**
- ✅ **Keep the repo's nav structure** — flattened **Home · Weddings · Events · Headshots ·
  About · Contact**. Not replicating the original's `Portfolio` parent.
- ✅ **Cart removed** — original had a Cart (0) icon; we are dropping commerce. Intentional
  omission, no action needed.
- ✅ **Logo size** — match the original. Original logo is capped at **max-height: 75px**
  (desktop and mobile). Repo logo is `h-12 w-auto sm:h-14` (48px / 56px) at
  [Nav.astro:17-21](src/components/Nav.astro#L17-L21). Bump to ~75px tall.

---

## Global Styling / CSS (applies to every page)

Files: [global.css](src/styles/global.css) (theme tokens) · [BaseLayout.astro](src/layouts/BaseLayout.astro) (font `<link>`)

The original is a Squarespace site; its real design tokens (pulled from the live site CSS) differ
from the repo's in three areas: **fonts, colors, and type scale**. These are the big visual gaps.

### Fonts

| Role | Original (live site) | Repo now | Action |
|---|---|---|---|
| Heading | **`orpheus-pro`** (Adobe Fonts serif), weight **400**, letter-spacing **0em** | `Cormorant Garamond`, weight 500, letter-spacing 0.01em | ☐ swap font + weight + tracking |
| Body | **`Inter Tight`**, weight 400 | `Inter`, weight 400 | ☐ swap to Inter Tight (free on Google Fonts) |

- ✅ **Heading font — DECISION: closest free serif** (no Adobe subscription). Switch
  `--font-display` from `Cormorant Garamond` to **`Cormorant`** — the display cut is the closest
  free match to Orpheus's elegant high-contrast old-style look (EB Garamond is the fallback
  candidate if Cormorant reads too thin at large sizes). Also drop heading weight 500 → **400**
  and letter-spacing 0.01em → **0** to match the original.
  - Update `--font-display` in [global.css:4](src/styles/global.css#L4) and the Google Fonts
    `<link>` in [BaseLayout.astro:31-34](src/layouts/BaseLayout.astro#L31-L34).
- ✅ **Body → Inter Tight.** Set `--font-sans` in [global.css:5](src/styles/global.css#L5) and
  add `Inter+Tight` to the font `<link>`. (Repo also needs its `font-weight: 500` on headings
  dropped to 400 and `letter-spacing` to 0 — [global.css:24-31](src/styles/global.css#L24-L31).)

### Colors

Original palette (converted from the live site's HSL tokens) vs. repo tokens:

| Token | Original | Repo now | Note |
|---|---|---|---|
| Background (`--color-paper`) | `#ffffff` pure white | `#faf8f5` warm cream | ☐ original is pure white |
| Text (`--color-ink`) | `#000000` pure black | `#171614` warm near-black | ☐ original is pure black |
| Accent (`--color-accent`) | `#a3826c` mauve-brown | `#a8875f` golden tan | ☐ shift toward mauve-brown |
| Light accent (`--color-stone-light`) | `#efefee` | `#e7e3da` | ☐ lighter/cooler in original |
| Dark accent | `#3e3d3d` | `--color-stone #8a8377` (mid gray) | ☐ original's dark tone is near-black |

- ✅ Update the five color tokens in [global.css:7-11](src/styles/global.css#L7-L11) to the
  original values above. Net effect: the original is a **crisper pure-black-on-white** look; the
  repo currently reads **warmer/creamier**.

### Type scale & casing

- ✅ **Heading sizes** — bumped home section headings to `text-5xl sm:text-6xl` (~3/3.75rem)
  and tile labels to `text-3xl sm:text-4xl`, closer to the original's larger scale.
- ✅ **Buttons — DECISION: match original (normal case).** Remove `uppercase tracking-wider`
  from buttons site-wide; original is normal case, weight 500, letter-spacing 0.
- ✅ **Nav links — DECISION: match original (normal case).** Remove `uppercase tracking-wider`
  from nav links ([Nav.astro:37](src/components/Nav.astro#L37) and the mobile list at
  [Nav.astro:62](src/components/Nav.astro#L62)). Styling only — the nav *structure* stays as-is
  per the decision above.

### Buttons (site-wide spec)

Original primary button vs. repo buttons:

| Property | Original | Repo now |
|---|---|---|
| Shape | **Rounded / pill** (border-radius ~150px → fully rounded on standard height) | Square (0 radius) |
| Fill | Solid accent color | Solid `bg-paper` / `bg-ink` |
| Padding | **2.4rem × 1.2rem** (~38px × 19px) | `px-6 py-3` (24px × 12px) |
| Font size | ~1.08rem (~17px) | `text-sm` (~14px) |
| Case | Normal case, weight 500 | `uppercase tracking-wider` |

- ✅ Rebuild the button style to match: rounded/pill corners, accent fill, larger padding
  (`px-[2.4rem] py-[1.2rem]` or equivalent), ~1.08rem normal-case text. Applies to every CTA
  (`Learn More`, `Contact Me`, `Reserve your date`, etc.).

### Scroll / load animations (site-wide — currently missing)

- ✅ **DONE (site-wide utility).** Added a `.reveal` fade+slide-up (24px, 0.7s ease) triggered by
  an IntersectionObserver in [BaseLayout.astro](src/layouts/BaseLayout.astro); `data-reveal-group`
  staggers children by 90ms. No-flash (`html.js` guard set before paint) and respects
  `prefers-reduced-motion`. Applied across the home page (hero, headings, paragraphs, buttons,
  images, tiles). **Reuse on other pages** by adding `.reveal` / `data-reveal-group` to elements.

> Suggested order of operations: settle the **heading font** decision first (Adobe kit vs. free
> serif), then colors, then buttons, then the scroll-animation utility, then per-page type
> sizes — since font choice affects how large/heavy the headings should be.

---

## Home Page (`/`) → [index.astro](src/pages/index.astro)

Original section order (top to bottom):
**Hero → "Capturing Memories" → "Photography For Every Occasion" → Testimonial → "Reserve your date"**

### 1. Hero
- ✅ Original hero is a **two-photo banner with NO text overlay** (Cass Winery, Paso Robles +
  Bahia Resort Hotel, San Diego County). Repo hero is a **single photo with a large H1 headline,
  a subheading, and a "Reserve Your Date" button** overlaid.
  - **For 1:1:** remove the H1 / subheading / button overlay and show the two-image banner with
    no text.
  - Repo lines: [index.astro:57-87](src/pages/index.astro#L57-L87)

### 2. Tagline — "Capturing Memories"
- ✅ **Heading** — change repo's `A Blend of Creativity & Precision` → **`Capturing Memories`**
  - Repo line: [index.astro:91](src/pages/index.astro#L91)
- ✅ **Body copy** — replace repo body with the exact original text:
  > Every event is filled with moments that make it truly special. I strive to capture these
  > moments with a blend of creativity and precision, ensuring that each photograph reflects the
  > beauty and emotion of your day. Together, we can create a collection of memories you'll
  > always cherish.
  - Repo lines: [index.astro:92-96](src/pages/index.astro#L92-L96)
- ✅ **"Learn More"** link → `/about` (matches original)

### 3. Services — "Photography For Every Occasion"
- ✅ **Add the section heading** `Photography For Every Occasion` above the three tiles — the repo
  currently renders the tiles with no heading.
  - Repo lines: [index.astro:106-131](src/pages/index.astro#L106-L131)
- ✅ Three tiles: **Weddings / Events / Headshots** (labels & pinned images already match)
- ✅ **Tile spacing** — original uses Squarespace Fluid Engine gutters that scale with the
  viewport (`calc(4vw − 11px)` desktop / `calc(6vw − 11px)` mobile), giving more air around and
  between images. Repo tiles use a tight fixed `gap-3` (12px) inside `max-w-6xl`. Loosen the gap
  and section padding to match the original's more spacious feel.
- ☐ **Image labels** — confirm whether the original overlays the Weddings/Events/Headshots labels
  on the images (repo does, bottom-left) or places them as captions below. Match the original.

### 4. Testimonial
- ✅ **Layout — RESOLVED.** Original is a **two-column white section**: Cayucos engagement photo
  on the LEFT, quote on the RIGHT (large serif, left-aligned, dark text). NOT full-bleed, NOT
  black. Repo rewritten to match.
- ✅ Quote — `"From start to finish, the experience was nothing short of amazing"` (matches)
- ✅ **Attribution wording** — original reads **"Laboni and Matthew"**; repo uses
  **"Laboni & Matthew"**. Change `&` → `and` for exact match.
  - Repo line: [index.astro:149](src/pages/index.astro#L149)
- ✅ Cayucos engagement photo present

### 5. CTA — "Reserve your date"
- ✅ **Layout — RESOLVED.** Original is a **two-column white section**: Colony Estate photo on
  the LEFT, heading + body + Contact Me button on the RIGHT. Repo rewritten to match.
- ✅ **Heading capitalization** — original is **`Reserve your date`** (lowercase "your date");
  repo has `Reserve Your Date`. Match the original casing.
  - Repo line: [index.astro:165](src/pages/index.astro#L165)
- ✅ **Body copy** — replace repo body with the exact original text:
  > I'm excited to hear more about your special event!
  - Repo lines: [index.astro:166-168](src/pages/index.astro#L166-L168)
- ✅ **"Contact Me"** button → `/contact` (matches original)

### Footer
- ⏭️ Skipped by request — keeping the repo's current footer.

---

## Additional global changes (done during the pass)

- ✅ **Global side gutters** — every page uses `mx-auto max-w-[1600px]` + `px-[6vw]`/`sm:px-[4vw]`
  (Nav, Footer, and all page sections). Narrow content (contact form, location intro) is capped
  and left-aligned inside the global container.
- ✅ **Base font size = 1.125rem (18px)** on `body` (matches the home "Capturing Memories" body).
  Explicit size utilities still win. Redundant `text-lg` removed from body copy.
- ✅ **Footer** — light-gray background (`stone-light` = original `lightAccent` #efefee), borderless,
  global gutter, normal-case links, roomier vertical padding.

---

## About (`/about`) → [about.astro](src/pages/about.astro)

- ✅ Two-column layout: bio text left, **square (1:1) portrait right**.
- ✅ No visible heading and no button (matches original); `sr-only` h1 kept for SEO/a11y.
- ✅ Exact bio copy (fixed the `moments..` double-period typo).

## Contact (`/contact`) → [contact.astro](src/pages/contact.astro)

- ✅ Heading **"Let's Chat!"** + original intro copy.
- ✅ Full 8-field form (Name, Email, Phone, Event Date, Event Type, Location,
  How did you hear about me?, Message), single-column, normal-case labels.
- ✅ Required asterisks on all fields **except** "How did you hear about me?" (matches original).
- ✅ Submit button **"Submit"**; success message "Thank you! I'll be in touch shortly."
- ✅ API ([api/contact.ts](src/pages/api/contact.ts)) captures the new phone/location/how-heard fields.
- ℹ️ Event Type options + input styling are best-guess (original form is JS-rendered; couldn't extract).

## Portfolio index (`/portfolio`) → [portfolio/index.astro](src/pages/portfolio/index.astro)

- ✅ **Built (was missing / would 404).** Three category tiles (Weddings / Events / Headshots),
  same pinned photos as the home tiles, no visible heading (`sr-only` h1), each links to its gallery.

## Portfolio galleries (`/portfolio/{weddings,events,headshots}`) → [\[category\].astro](src/pages/portfolio/[category].astro)

- ✅ Headings → "Wedding Portfolio" / "Event Portfolio" / "Headshot Portfolio" (`portfolioTitle`).
- ✅ Removed intro paragraph (original has none); descriptive text kept for SEO meta/schema only.
- ✅ **Order-preserving masonry gallery** ([Gallery.astro](src/components/Gallery.astro)) — CSS grid +
  row-span, favors vertical photos, keeps upload order. Applies to location pages too.

## Redirects → [astro.config.mjs](astro.config.mjs)

- ✅ Original home slug `/neil-johnson-events-los-angeles-county-wedding-and-event-photographer`
  → 301 redirect to `/` (preserves inbound links).

---

## Not in the original (repo additions — kept intentionally)

- SEO location landing pages (`/{service}-photographer/{location}`) — not on the original site;
  added for search visibility. Show a 6-image preview + link to the full gallery.
- Custom contact backend (Resend via `/api/contact`) instead of the Squarespace form.

## Sitemap parity check (original vs repo)

All original sitemap URLs are now covered: `/`, `/about`, `/contact`, `/portfolio`,
`/portfolio/{weddings,events,headshots}`, and the home-slug redirect. ✅
