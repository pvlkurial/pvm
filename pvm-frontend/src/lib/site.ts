import type { Metadata } from "next";
import { API_BASE } from "@/constants/miscellaneous";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pvms.club";
export const SITE_NAME = "pvms.club";
export const SITE_DESCRIPTION = "Player vs Map Tracking Platform";

/** Shared by link previews when a page has no image of its own. */
export const DEFAULT_SHARE_IMAGE =
  "https://core.trackmania.nadeo.live/maps/d0030278-ac88-4392-91df-ce9c14024dd9/thumbnail.jpg";

/**
 * Server-side GET against the API for metadata and the sitemap. Cached for a
 * while, and null on any failure so a slow API never breaks a page render.
 */
export async function fetchForMetadata<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE}${path}`, { next: { revalidate: 3600 } });
    return response.ok ? ((await response.json()) as T) : null;
  } catch {
    return null;
  }
}

interface PageMetadataInput {
  title: string;
  description: string;
  /** Path from the site root, used as the canonical URL. */
  path: string;
  image?: string;
}

/**
 * Metadata for one page. Next replaces rather than merges a parent's
 * openGraph/twitter objects, so the shared fields are repeated here.
 */
export function pageMetadata({ title, description, path, image }: PageMetadataInput): Metadata {
  const images = [image || DEFAULT_SHARE_IMAGE];
  return {
    // Written out in full: a plain-string title in a parent layout stops the
    // root template from reaching deeper segments.
    title: { absolute: `${title} | ${SITE_NAME}` },
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: SITE_NAME, url: path, title, description, images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}
