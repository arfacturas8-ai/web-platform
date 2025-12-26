import * as React from "react"
import { Input } from "./input"
import { Label } from "./label"

interface DateRange {
  from: Date | undefined
  to: Date | undefined
}

interface DateRangePickerProps {
  date: DateRange
  onDateChange: (date: DateRange) => void
  className?: string
}

export function DatePickerWithRange({ date, onDateChange, className }: DateRangePickerProps) {
  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFrom = e.target.value ? new Date(e.target.value) : undefined
    onDateChange({ ...date, from: newFrom })
  }

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTo = e.target.value ? new Date(e.target.value) : undefined
    onDateChange({ ...date, to: newTo })
  }

  return (
    <div className={`flex gap-2 items-center ${className || ''}`}>
      <div className="space-y-1">
        <Label className="text-xs">From</Label>
        <Input
          type="date"
          value={date.from?.toISOString().split('T')[0] || ''}
          onChange={handleFromChange}
          className="w-[150px]"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">To</Label>
        <Input
          type="date"
          value={date.to?.toISOString().split('T')[0] || ''}
          onChange={handleToChange}
          className="w-[150px]"
        />
      </div>
    </div>
  )
}

export type { DateRange }
