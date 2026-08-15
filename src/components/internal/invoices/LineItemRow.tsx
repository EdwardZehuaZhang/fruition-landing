'use client'

import { Trash2 } from 'lucide-react'
import type { LineItem } from '@/types/invoice'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Props {
  item: LineItem
  index: number
  currency: string
  onChange: (index: number, field: 'projectName' | 'description' | 'hours', value: string | number) => void
  onRemove: (index: number) => void
}

/**
 * One billable project. Hours are the only number worth editing per row — the
 * rate is set once for the whole invoice, so the amount is just shown.
 */
export default function LineItemRow({ item, index, currency, onChange, onRemove }: Props) {
  return (
    <div className="rounded-lg border bg-muted/30 p-3">
      <div className="flex items-start gap-2">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <Input
            placeholder="Project"
            value={item.projectName}
            onChange={(e) => onChange(index, 'projectName', e.target.value)}
            className="font-medium"
          />
          <textarea
            placeholder="Description (optional)"
            value={item.description}
            onChange={(e) => onChange(index, 'description', e.target.value)}
            className="w-full resize-y rounded-md border bg-background px-3 py-2 text-sm"
            rows={2}
          />
        </div>

        <div className="flex w-24 shrink-0 flex-col gap-1">
          <label className="text-xs text-muted-foreground">Hours</label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={item.hours || ''}
            onChange={(e) => onChange(index, 'hours', parseFloat(e.target.value) || 0)}
          />
        </div>

        <div className="flex w-28 shrink-0 flex-col gap-1">
          <span className="text-xs text-muted-foreground">{currency}</span>
          <p className="py-2 text-right text-sm font-medium tabular-nums">
            {item.total.toFixed(2)}
          </p>
        </div>

        <Button
          size="icon"
          variant="ghost"
          onClick={() => onRemove(index)}
          aria-label={'Remove ' + (item.projectName || 'line item')}
          className="mt-5 shrink-0 text-destructive hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  )
}
