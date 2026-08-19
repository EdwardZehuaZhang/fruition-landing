import { createImageUrlBuilder } from "@sanity/image-url"
import { dataset, projectId } from "./env"

const builder = createImageUrlBuilder({ projectId, dataset })

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const urlFor = (source: any) => builder.image(source)

/**
 * Standard image size presets for common use cases.
 *
 * Always prefer these over bare urlFor(ref).url() to avoid serving
 * full-resolution originals through the CDN (a major driver of quota overage).
 */
export function heroImage(source: any) {
  return urlFor(source).width(1440).auto("format").url()
}
export function contentImage(source: any) {
  return urlFor(source).width(800).auto("format").url()
}
export function cardImage(source: any, width = 800, height = 600) {
  return urlFor(source).width(width).height(height).fit("crop").auto("format").url()
}
export function thumbnailImage(source: any, size = 200) {
  return urlFor(source).width(size).height(size).fit("crop").auto("format").url()
}
export function ogImage(source: any) {
  return urlFor(source).width(1200).height(630).fit("crop").auto("format").url()
}
