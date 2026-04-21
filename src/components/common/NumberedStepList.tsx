/**
 * NumberedStepList — unified component for all numbered step layouts across site
 * Handles simple (title + description) and complex (title + description + bullets) step layouts
 * Single source of truth for step card spacing, typography, and responsive behavior
 */

interface StepBullet {
  _key?: string
  emoji?: string
  icon?: string
  text?: string
  label?: string
}

interface StepItem {
  _key?: string
  number?: string
  icon?: string
  title?: string
  label?: string
  description?: string
  bullets?: StepBullet[]
}

interface NumberedStepListProps {
  items: StepItem[]
  containerClassName?: string
  stepRowClassName?: string
}

export default function NumberedStepList({
  items,
  containerClassName = 'ui-surface-panel w-full max-w-[816px] p-2 sm:p-3',
  stepRowClassName = 'ui-step-row',
}: NumberedStepListProps) {
  if (!items || items.length === 0) return null

  return (
    <div className={containerClassName}>
      {items.map((item, i) => {
        const title = item.title || item.label || ''
        const description = item.description || ''
        const hasBullets = item.bullets && item.bullets.length > 0
        const number = item.number || item.icon || String(i + 1).padStart(2, '0')

        return (
          <div key={item._key || `step-${i}`} className={stepRowClassName}>
            {/* Step number */}
            <span className="ui-step-number">
              {number}
            </span>

            {/* Step content */}
            <div className="flex-1">
              {/* Simple layout: title + description inline */}
              {!hasBullets && (
                <p className="ui-step-copy">
                  {title && <span className="font-semibold">{title}</span>}
                  {description && (
                    <span className="font-normal">
                      {title ? ' ' : ''}{description}
                    </span>
                  )}
                </p>
              )}

              {/* Complex layout: title, description, then bullets */}
              {hasBullets && item.bullets && (
                <>
                  {title && (
                    <p className="font-semibold text-[1rem] leading-[1.6] text-black mb-2">
                      {title}
                    </p>
                  )}
                  {description && (
                    <p className="text-body-sm text-black mb-3">
                      {description}
                    </p>
                  )}
                  <div className="flex flex-col gap-2">
                    {item.bullets.map((bullet, bi) => (
                      <div
                        key={bullet._key || `bullet-${bi}`}
                        className="flex items-start gap-2"
                      >
                        {(bullet.emoji || bullet.icon) && (
                          <span className="text-[1rem] shrink-0">
                            {bullet.emoji || bullet.icon}
                          </span>
                        )}
                        <span className="text-body-sm text-black">
                          {bullet.text || bullet.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
