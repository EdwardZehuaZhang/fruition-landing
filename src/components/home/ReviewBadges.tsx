import Image from "next/image"

export const G2_REVIEWS_URL = "https://www.g2.com/products/fruition-services/reviews"
export const TRUSTPILOT_REVIEWS_URL = "https://www.trustpilot.com/review/fruitionservices.io"

/**
 * Live figures, verified against both profiles on 2026-09-01. These are the real
 * counts — keep them in step with the profiles rather than rounding them up, and
 * re-check whenever the badges are touched.
 */
export const G2_RATING = "5.0"
export const G2_COUNT: number = 1
export const TRUSTPILOT_SCORE = "4.0"
export const TRUSTPILOT_COUNT: number = 3

interface Props {
  /**
   * Show the review counts. Off gives logo + score only, which reads better
   * while the profiles are still in single digits.
   */
  showCounts?: boolean
  className?: string
}

const cardClass =
  "flex flex-1 flex-col items-start gap-2.5 rounded-card border border-ui bg-surface-raised px-4 py-3.5 transition-shadow hover:shadow-[0_10px_26px_-18px_rgba(64,12,140,0.45)]"

/**
 * Trustpilot and G2 rating badges, sized to sit under the Client proof CTA.
 * Each badge is a single external link to the source profile, so the score is
 * always one click from the reviews that back it.
 *
 * Both logos are the vendors' own marks, kept as assets under
 * `public/images/home/logos` so their brand colours stay out of the token layer.
 */
export default function ReviewBadges({ showCounts = true, className = "" }: Props) {
  return (
    <div className={`flex flex-col gap-3 md:flex-row ${className}`}>
      <a
        href={TRUSTPILOT_REVIEWS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={cardClass}
        aria-label={`Fruition Services on Trustpilot: TrustScore ${TRUSTPILOT_SCORE} from ${TRUSTPILOT_COUNT} reviews. Opens in a new tab.`}
      >
        <Image
          src="/images/home/logos/trustpilot.svg"
          alt="Trustpilot"
          width={1133}
          height={278}
          unoptimized
          className="h-[19px] w-auto"
        />
        <Image
          src="/images/home/logos/trustpilot-stars-4.svg"
          alt=""
          aria-hidden
          width={432}
          height={80}
          unoptimized
          className="h-5 w-auto"
        />
        <span className="text-[12px] leading-4 whitespace-nowrap text-muted">
          TrustScore {TRUSTPILOT_SCORE}
          {showCounts && (
            <>
              <span aria-hidden className="mx-1 text-faint">
                |
              </span>
              {TRUSTPILOT_COUNT} {TRUSTPILOT_COUNT === 1 ? "review" : "reviews"}
            </>
          )}
        </span>
      </a>

      <a
        href={G2_REVIEWS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={cardClass}
        aria-label={`Fruition Services on G2: rated ${G2_RATING} out of 5 from ${G2_COUNT} review. Opens in a new tab.`}
      >
        <span className="flex items-center gap-2">
          <Image
            src="/images/home/logos/g2.svg"
            alt=""
            aria-hidden
            width={22}
            height={22}
            unoptimized
            className="size-[22px]"
          />
          <span className="text-[15px] leading-5 font-bold tracking-[-0.01em] text-foreground">
            Reviews
          </span>
        </span>
        <span className="flex items-center gap-2">
          <span className="text-[15px] leading-5 font-bold tracking-[-0.01em] text-foreground">
            {G2_RATING}
          </span>
          <Image
            src="/images/home/logos/g2-stars-5.svg"
            alt=""
            aria-hidden
            width={140}
            height={24}
            unoptimized
            className="h-4 w-auto"
          />
        </span>
        <span className="text-[12px] leading-4 whitespace-nowrap text-muted">
          {showCounts
            ? `(${G2_COUNT} ${G2_COUNT === 1 ? "review" : "reviews"})`
            : "Verified on G2"}
        </span>
      </a>
    </div>
  )
}
