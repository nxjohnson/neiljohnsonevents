// Maps site categories to SmugMug albums. Fill in the AlbumKey for each once your
// galleries are public — find it in the SmugMug album's URL or via the API's
// `/user/{nickname}!albums` listing (see src/lib/smugmug.ts -> getAlbums).

export const SMUGMUG_NICKNAME = import.meta.env.SMUGMUG_NICKNAME ?? "";

export interface GalleryCategory {
  slug: "weddings" | "events" | "headshots";
  label: string;
  albumKey: string;
  heading: string;
  description: string;
}

export const galleries: GalleryCategory[] = [
  {
    slug: "weddings",
    label: "Weddings",
    albumKey: "TODO-WEDDINGS-ALBUM-KEY",
    heading: "Wedding Photography",
    description:
      "Wedding photography across Los Angeles County and Orange County — capturing every moment with creativity and precision.",
  },
  {
    slug: "events",
    label: "Events",
    albumKey: "TODO-EVENTS-ALBUM-KEY",
    heading: "Corporate Event & Conference Photography",
    description:
      "Corporate event and conference photography for businesses across Los Angeles County and Orange County.",
  },
  {
    slug: "headshots",
    label: "Headshots",
    albumKey: "TODO-HEADSHOTS-ALBUM-KEY",
    heading: "Headshot Photography",
    description:
      "Professional headshot photography for individuals and businesses across Los Angeles County and Orange County.",
  },
];

export function getGalleryBySlug(slug: string): GalleryCategory | undefined {
  return galleries.find((g) => g.slug === slug);
}
