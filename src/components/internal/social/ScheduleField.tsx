"use client"

import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

/**
 * When a post goes out: a calendar for the day, a time field beside it.
 *
 * Replaces `<input type="datetime-local">`, which renders as a different
 * control in every browser and reads as an unstyled escapee next to the rest
 * of the portal. Past days are disabled here rather than only being rejected
 * by the server, so the mistake isn't possible in the first place.
 *
 * Value is the same `YYYY-MM-DDTHH:mm` string datetime-local produced, so the
 * publish call is unchanged and it still means local time.
 */

function parse(value: string): { date?: Date; time: string } {
  const [datePart, timePart] = value.split("T")
  if (!datePart) return { time: "09:00" }
  const [y, m, d] = datePart.split("-").map(Number)
  if (!y || !m || !d) return { time: timePart || "09:00" }
  return { date: new Date(y, m - 1, d), time: timePart || "09:00" }
}

function join(date: Date | undefined, time: string): string {
  if (!date) return ""
  const p = (n: number) => String(n).padStart(2, "0")
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}T${time || "09:00"}`
}

export default function ScheduleField({
  value,
  onChange,
  disabled = false,
}: {
  /** "YYYY-MM-DDTHH:mm", or "" for nothing chosen. */
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  const { date, time } = parse(value)

  // Compare against the start of today so "later today" stays selectable.
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              size="sm"
              disabled={disabled}
              nativeButton
              className="justify-start font-normal"
            >
              <CalendarIcon />
              {date
                ? date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })
                : "Pick a date"}
            </Button>
          }
        />
        <PopoverContent align="end" className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            defaultMonth={date}
            autoFocus
            disabled={{ before: today }}
            onSelect={(next) => {
              onChange(join(next ?? undefined, time))
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>

      <input
        type="time"
        value={time}
        step={300}
        disabled={disabled || !date}
        aria-label="Time"
        onChange={(e) => onChange(join(date, e.target.value))}
        className="h-8 w-[7.5rem] rounded-md border border-border bg-background px-2 text-sm text-foreground outline-none transition focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/20 disabled:opacity-60"
      />
    </div>
  )
}
