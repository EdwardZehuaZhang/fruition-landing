import { urlFor } from "@/sanity/image"

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.fruitionservices.io"
const SITE_NAME = "Fruition"
const DEFAULT_OG_IMAGE = `${SITE_URL}/opengraph-image.png`
const DEFAULT_TITLE =
  "Fruition | monday.com Platinum Partners | monday CRM Experts"
const DEFAULT_DESCRIPTION =
  "monday.com Partner certified - Fruition is an expert in Monday implementation and integration. Our monday.com consultants partners with you to integrate and automate Sales, Projects & Operations"

export interface OgMetadataInput {
  title?: string | null
  description?: string | null
  path: string
  image?: string | null
  /** Sanity image source — resolved via urlFor to 1200×630. Takes precedence over `image`. */
  ogImageSource?: unknown
  /** Extra OpenGraph / Twitter fields merged on top of the generated defaults. */
  extra?: {
    openGraph?: Record<string, unknown>
    twitter?: Record<string, unknown>
  }
}

/**
 * Build openGraph + twitter metadata objects for a page.
 *
 * Falls back to site-wide defaults when title/description are empty.
 * Supports `ogImageSource` (Sanity image ref) and `extra` for article metadata.
 */
export function buildOgMetadata(input: OgMetadataInput) {
  const url = `${SITE_URL}${input.path}`
  const title = input.title || DEFAULT_TITLE
  const description = input.description || DEFAULT_DESCRIPTION
  const image = buildOgImage(input.ogImageSource, input.image)

  const og: Record<string, unknown> = {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url,
    title,
    description,
    images: image ? [{ url: image, width: 1200, height: 630 }] : [],
    ...(input.extra?.openGraph ?? {}),
  }

  const tw: Record<string, unknown> = {
    card: "summary_large_image",
    title,
    description,
    images: image ? [image] : [],
    ...(input.extra?.twitter ?? {}),
  }

  return {
    openGraph: og,
    twitter: tw,
  }
}

/**
 * Build an absolute image URL from a Sanity image reference.
 *
 * Uses 1200×630 crop suitable for OG/Twitter cards.
 * Falls back to the site-wide default OG image when source is missing/invalid.
 */
export function buildOgImage(
  source?: unknown,
  fallbackUrl?: string | null,
): string {
  if (!source) return fallbackUrl || DEFAULT_OG_IMAGE
  try {
    return urlFor(source).width(1200).height(630).fit("crop").url()
  } catch {
    return fallbackUrl || DEFAULT_OG_IMAGE
  }
}

/**
 * Async convenience export for root layout back-compat.
 * Returns the default OG image URL.
 */
export async function defaultOgImage(): Promise<string> {
  return DEFAULT_OG_IMAGE
}
