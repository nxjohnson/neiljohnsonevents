// Maps site categories to SmugMug albums. Fill in the AlbumKey for each once your
// galleries are public — find it in the SmugMug album's URL or via the API's
// `/user/{nickname}!albums` listing (see src/lib/smugmug.ts -> getAlbums).

import type { ResponsiveImage } from "../lib/smugmug";

export const SMUGMUG_NICKNAME = import.meta.env.SMUGMUG_NICKNAME ?? "";

export interface GalleryCategory {
  slug: "weddings" | "events" | "headshots";
  label: string;
  albumKey: string;
  /** Representative photo for the category tile — pinned by SmugMug ImageKey so it
      stays put if the album is reordered. Used by the homepage + /portfolio tiles. */
  pinnedKey: string;
  /** Visible <h1> on the portfolio page (matches the original site). */
  portfolioTitle: string;
  /** Descriptive heading used for the SEO <title> and schema (not shown on the page). */
  heading: string;
  /** Used for the SEO meta description and schema (not shown on the page). */
  description: string;
}

export const galleries: GalleryCategory[] = [
  {
    slug: "weddings",
    label: "Weddings",
    albumKey: "hDBJG2",
    pinnedKey: "d6nGnqZ", // 30_01-Cass-Winery-Paso-Robles-Wedding-Photography.jpg
    portfolioTitle: "Wedding Portfolio",
    heading: "Wedding Photography",
    description:
      "Wedding photography across Los Angeles County and Orange County — capturing every moment with creativity and precision.",
  },
  {
    slug: "events",
    label: "Events",
    albumKey: "6wRgR8",
    pinnedKey: "ntbbBm3", // 01_01-Las-Vegas-Nevada-Concert-Photography.jpg
    portfolioTitle: "Event Portfolio",
    heading: "Corporate Event & Conference Photography",
    description:
      "Corporate event and conference photography for businesses across Los Angeles County and Orange County.",
  },
  {
    slug: "headshots",
    label: "Headshots",
    albumKey: "x5mcLx",
    pinnedKey: "jp67F4C", // 15_02-Los-Angeles-County-Business-Headshot-Photography.jpg
    portfolioTitle: "Headshot Portfolio",
    heading: "Headshot Photography",
    description:
      "Professional headshot photography for individuals and businesses across Los Angeles County and Orange County.",
  },
];

export function getGalleryBySlug(slug: string): GalleryCategory | undefined {
  return galleries.find((g) => g.slug === slug);
}

/** Resolve a category's pinned image from its album images (falls back to the first). */
export function pinnedImage(
  images: ResponsiveImage[],
  key: string
): ResponsiveImage | undefined {
  return images.find((img) => img.key === key) ?? images[0];
}

/**
 * Build the category tiles used by the homepage and the /portfolio index.
 * `galleryImages` must be in the same order as `galleries` (i.e. `galleries.map(fetch)`).
 */
export function toTiles(galleryImages: ResponsiveImage[][]) {
  return galleries.map((category, i) => ({
    category,
    image: pinnedImage(galleryImages[i] ?? [], category.pinnedKey),
  }));
}
