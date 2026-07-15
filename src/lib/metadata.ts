import type { Metadata } from "next"

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.fruitionservices.io"

export async function buildOgImageUrl(
  imageSource: unknown,
  width = 1200,
  height = 630,
): Promise<string | null> {
  if (!imageSource) return null
  try {
    const { urlFor } = await import("@/sanity/image")
    return urlFor(imageSource).width(width).height(height).url()
  } catch {
    return null
  }
}

export async function defaultOgImage(): Promise<string> {
  try {
    const { getSiteSettings } = await import("@/sanity/queries")
    const s = await getSiteSettings()
    if (s?.logo) {
      const { urlFor } = await import("@/sanity/image")
      return urlFor(s.logo).width(1200).height(630).url()
    }
  } catch {
    // fall through
  }
  return BASE + "/og-image.png"
}

export interface OgMetaInput {
  title: string
  description: string
  path: string
  ogImageSource?: unknown
  siteName?: string
  extra?: Partial<Metadata>
}

export async function buildOgMetadata(input: OgMetaInput): Promise<Metadata> {
  const { title, description, path, ogImageSource, siteName, extra } = input
  let ogImage: string
  if (ogImageSource) {
    const img = await buildOgImageUrl(ogImageSource)
    ogImage = img ?? await defaultOgImage()
  } else {
    ogImage = await defaultOgImage()
  }
  return {
    title,
    description,
    alternates: { canonical: BASE + path },
    openGraph: {
      type: "website" as const,
      siteName: siteName ?? "Fruition",
      locale: "en_US",
      title,
      description,
      url: BASE + path,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images: [ogImage],
    },
    ...extra,
  }
}
