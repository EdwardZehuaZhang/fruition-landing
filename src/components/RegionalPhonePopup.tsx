'use client'

import { useRef } from 'react'
import { Phone, X } from 'lucide-react'
import { officesWithPhone, telHref, type Office } from '@/lib/officePhone'

interface Props {
  offices: Office[]
}

/**
 * Footer phone entry point.
 *
 * The footer used to print every office number in one unlabelled row, so a
 * visitor saw five international numbers with no way to tell which one was
 * their region. One phone button now opens a dialog that names each office
 * beside its number, and every number stays a tel: link.
 *
 * Built on the native <dialog> element: focus trapping, Escape-to-close and
 * inert background come from the platform rather than from hand-rolled key
 * handlers. Tailwind's preflight zeroes the UA `margin: auto` that centres a
 * modal dialog, hence the explicit m-auto.
 */
export default function RegionalPhonePopup({ offices }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const callable = officesWithPhone(offices)

  if (callable.length === 0) return null

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="flex items-start gap-2 text-left text-white transition-opacity hover:opacity-80"
      >
        <Phone size={16} strokeWidth={1.5} aria-hidden className="mt-[2px] shrink-0" />
        <span className="text-[13px] leading-[20px]">
          Call us - {callable.length} regional offices
        </span>
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="regional-phone-title"
        // Clicking the ::backdrop reports the dialog itself as the target.
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close()
        }}
        className="rounded-card border-ui bg-surface shadow-card m-auto w-[min(92vw,420px)] border p-0 backdrop:bg-black/50"
      >
        <div className="p-6 md:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-micro text-brand font-bold tracking-[0.12em] uppercase">
                Call us
              </p>
              <h2 id="regional-phone-title" className="text-section-h3 text-foreground mt-2">
                Our regional offices
              </h2>
            </div>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Close"
              className="text-muted hover:text-brand -mt-1 -mr-1 p-1 transition-colors"
            >
              <X size={18} aria-hidden />
            </button>
          </div>

          <ul className="border-ui mt-6 border-t border-dashed">
            {callable.map((office, i) => (
              <li
                key={`${office.city || office.phoneTel}-${i}`}
                className="border-ui border-b border-dashed"
              >
                <a
                  href={telHref(office.phone, office.phoneTel)}
                  className="group flex items-center gap-3 py-3.5"
                >
                  {office.flag && (
                    <span aria-hidden className="text-lg leading-none">
                      {office.flag}
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="text-caption text-foreground block font-medium">
                      {office.city}
                    </span>
                    {office.label && (
                      <span className="text-micro text-muted block">{office.label}</span>
                    )}
                  </span>
                  <span className="text-caption text-brand font-mono whitespace-nowrap group-hover:underline">
                    {office.phone}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </dialog>
    </>
  )
}
