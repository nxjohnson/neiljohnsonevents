// Build-time SmugMug fetch helpers. Public galleries can be read with an API key
// only (no OAuth) — see https://api.smugmug.com/api/v2/doc/tutorial/authorization.html
//
// Response shape reference (SmugMug API v2):
//   { Response: { <Locator>: [...] | {...}, Pages: {...} }, Code, Message }
// Albums list locator: "Album" (array). Album images locator: "AlbumImage" (array).
// `_expand=ImageSizeDetails` on the album list is NOT honored under API-key-only auth,
// so each image's real per-size data is fetched separately via its `Uris.ImageSizeDetails.Uri`
// link, which nests per-size objects under
// ImageSizeDetails.ImageSize{Tiny,Thumb,Small,Medium,Large,XLarge,X2Large,X3Large}.Url/Width/Height.

const API_BASE = "https://api.smugmug.com/api/v2";

interface SmugMugImageSize {
  Url: string;
  Width: number;
  Height: number;
}

interface SmugMugImageSizeDetails {
  ImageSizeTiny?: SmugMugImageSize;
  ImageSizeThumb?: SmugMugImageSize;
  ImageSizeSmall?: SmugMugImageSize;
  ImageSizeMedium?: SmugMugImageSize;
  ImageSizeLarge?: SmugMugImageSize;
  ImageSizeXLarge?: SmugMugImageSize;
  ImageSizeX2Large?: SmugMugImageSize;
  ImageSizeX3Large?: SmugMugImageSize;
  ImageSizeOriginal?: SmugMugImageSize;
}

interface SmugMugImage {
  ImageKey: string;
  FileName: string;
  Title: string;
  Caption: string;
  KeywordArray?: string[];
  ThumbnailUrl: string;
  OriginalWidth: number;
  OriginalHeight: number;
  ImageSizeDetails?: SmugMugImageSizeDetails;
  Uris?: {
    ImageSizeDetails?: { Uri: string };
  };
}

interface SmugMugAlbum {
  AlbumKey: string;
  Name: string;
  UrlName: string;
  ImageCount: number;
}

export interface ResponsiveImage {
  key: string;
  alt: string;
  src: string;
  srcset: string;
  width: number;
  height: number;
}

function apiKey(): string {
  const key = import.meta.env.SMUGMUG_API_KEY;
  if (!key) {
    throw new Error(
      "SMUGMUG_API_KEY is not set. Add it to .dev.vars locally or as a Cloudflare Pages secret."
    );
  }
  return key;
}

async function smugmugFetch<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${API_BASE}${path}`);
  url.searchParams.set("APIKey", apiKey());
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    throw new Error(`SmugMug API error ${res.status} for ${path}: ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}

/** Fetch an absolute API path returned by the API itself (e.g. a Uris.*.Uri link). */
async function smugmugFetchByUri<T>(uri: string): Promise<T> {
  const url = new URL(`https://api.smugmug.com${uri}`);
  url.searchParams.set("APIKey", apiKey());

  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    throw new Error(`SmugMug API error ${res.status} for ${uri}: ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}

/**
 * Fetch real per-size URLs/dimensions for one image. The album list endpoint's
 * `_expand=ImageSizeDetails` is not honored under API-key-only auth, so each
 * image only carries a link to this endpoint (`Uris.ImageSizeDetails.Uri`) —
 * without this call the code would silently fall back to `ThumbnailUrl`, a
 * 150x150 square crop, mislabeled with the original image's width/height.
 */
async function getImageSizeDetails(uri: string): Promise<SmugMugImageSizeDetails | undefined> {
  const data = await smugmugFetchByUri<{ Response: { ImageSizeDetails?: SmugMugImageSizeDetails } }>(
    uri
  );
  return data.Response.ImageSizeDetails;
}

/** List all albums for the configured account. */
export async function getAlbums(nickname: string): Promise<SmugMugAlbum[]> {
  const data = await smugmugFetch<{ Response: { Album?: SmugMugAlbum[] } }>(
    `/user/${nickname}!albums`,
    { count: "100" }
  );
  return data.Response.Album ?? [];
}

const SIZE_DETAILS_CONCURRENCY = 8;

/** List all images in an album, with size details fetched per-image for responsive srcset. */
export async function getAlbumImages(albumKey: string): Promise<SmugMugImage[]> {
  const data = await smugmugFetch<{ Response: { AlbumImage?: SmugMugImage[] } }>(
    `/album/${albumKey}!images`,
    { count: "200" }
  );
  const images = data.Response.AlbumImage ?? [];
  images.sort((a, b) => a.FileName.localeCompare(b.FileName, undefined, { numeric: true }));

  for (let i = 0; i < images.length; i += SIZE_DETAILS_CONCURRENCY) {
    const batch = images.slice(i, i + SIZE_DETAILS_CONCURRENCY);
    await Promise.all(
      batch.map(async (img) => {
        const uri = img.Uris?.ImageSizeDetails?.Uri;
        if (!uri) return;
        img.ImageSizeDetails = await getImageSizeDetails(uri);
      })
    );
  }

  return images;
}

const SRCSET_ORDER: (keyof SmugMugImageSizeDetails)[] = [
  "ImageSizeSmall",
  "ImageSizeMedium",
  "ImageSizeLarge",
  "ImageSizeXLarge",
  "ImageSizeX2Large",
  "ImageSizeX3Large",
];

/** Turn a SmugMug image + its expanded size details into a mobile-first responsive image. */
export function toResponsiveImage(image: SmugMugImage, altFallback: string): ResponsiveImage {
  const sizes = image.ImageSizeDetails;
  const entries = SRCSET_ORDER.map((k) => sizes?.[k]).filter((s): s is SmugMugImageSize => !!s);

  const srcset = entries.map((s) => `${s.Url} ${s.Width}w`).join(", ");
  const fallback = entries[Math.min(1, entries.length - 1)] ?? entries[0];

  return {
    key: image.ImageKey,
    alt: image.Caption || image.Title || altFallback,
    src: fallback?.Url ?? image.ThumbnailUrl,
    srcset,
    width: fallback?.Width ?? image.OriginalWidth,
    height: fallback?.Height ?? image.OriginalHeight,
  };
}

/**
 * Convenience: fetch an album's images already mapped to responsive images.
 * Fails soft (logs a warning, returns []) so the site still builds before
 * SmugMug is fully configured — pages should render an empty-state for [].
 */
export async function getGalleryImages(
  albumKey: string,
  altFallback: string
): Promise<ResponsiveImage[]> {
  if (!import.meta.env.SMUGMUG_API_KEY || albumKey.startsWith("TODO-")) {
    console.warn(`[smugmug] Skipping fetch for "${albumKey}" — API key or album key not set.`);
    return [];
  }

  try {
    const images = await getAlbumImages(albumKey);
    return images.map((img) => toResponsiveImage(img, altFallback));
  } catch (err) {
    console.warn(`[smugmug] Failed to fetch album "${albumKey}":`, err);
    return [];
  }
}
