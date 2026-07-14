'use client'

import { Trash2 } from 'lucide-react'
import type { LineItem } from '@/types/invoice'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Props {
  item: LineItem
  index: number
  currency: string
  onChange: (index: number, field: keyof LineItem, value: string | number) => void
  onRemove: (index: number) => void
}

export default function LineItemRow({ item, index, currency, onChange, onRemove }: Props) {
  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <Input
          placeholder="Project/Item Name"
          value={item.projectName}
          onChange={(e) => onChange(index, 'projectName', e.target.value)}
          className="font-medium"
          readOnly={!!item.projectId}
        />
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onRemove(index)}
          className="shrink-0 text-destructive hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
      <textarea
        placeholder="Description of work performed..."
        value={item.description}
        onChange={(e) => onChange(index, 'description', e.target.value)}
        className="mb-3 w-full rounded-md border bg-background px-3 py-2 text-sm resize-none"
        rows={2}
      />
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">Hours</label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={item.hours || ''}
            onChange={(e) =>
              onChange(index, 'hours', parseFloat(e.target.value) || 0)
            }
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">
            Rate ({currency})
          </label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={item.rate || ''}
            onChange={(e) =>
              onChange(index, 'rate', parseFloat(e.target.value) || 0)
            }
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">Total</label>
          <Input
            value={item.total.toFixed(2)}
            readOnly
            className="bg-muted"
          />
        </div>
      </div>
    </div>
  )
}
