// Service × location matrix for long-tail SEO landing pages, e.g.
// /wedding-photographer/orange-county. These target realistically winnable
// searches that ladder up to the competitive head terms Neil wants to rank for.
import type { GalleryCategory } from "./galleries";

export interface Service {
  slug: string;
  label: string; // e.g. "Wedding Photographer"
  gallerySlug: GalleryCategory["slug"];
  blurb: string; // used to build page intro copy
}

export interface Location {
  slug: string;
  label: string; // e.g. "Orange County"
}

export const services: Service[] = [
  {
    slug: "wedding-photographer",
    label: "Wedding Photographer",
    gallerySlug: "weddings",
    blurb: "wedding photography that captures every unscripted moment",
  },
  {
    slug: "corporate-event-photographer",
    label: "Corporate Event Photographer",
    gallerySlug: "events",
    blurb: "corporate event photography for brands, offices, and company gatherings",
  },
  {
    slug: "conference-photographer",
    label: "Conference Photographer",
    gallerySlug: "events",
    blurb: "conference photography covering keynotes, panels, and networking",
  },
  {
    slug: "headshot-photographer",
    label: "Headshot Photographer",
    gallerySlug: "headshots",
    blurb: "professional headshots for individuals and teams",
  },
];

export const locations: Location[] = [
  { slug: "los-angeles-county", label: "Los Angeles County" },
  { slug: "orange-county", label: "Orange County" },
];

export function buildLandingCopy(service: Service, location: Location) {
  const title = `${service.label} in ${location.label}`;
  const description = `${service.label} serving ${location.label} — ${service.blurb}. Based in Los Angeles County, available throughout ${location.label}.`;
  const intro = `Looking for a ${service.label.toLowerCase()} in ${location.label}? I offer ${service.blurb}, with experience shooting throughout ${location.label} and the greater Los Angeles area.`;

  return { title, description, intro };
}
