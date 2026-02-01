import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export type DateRange = {
  from: Date
  to: Date
}

interface DateRangePickerProps {
  value: DateRange
  onChange: (range: DateRange) => void
  className?: string
}

export function DateRangePicker({ value, onChange, className }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const presets = [
    {
      label: "Today",
      getValue: () => ({
        from: new Date(),
        to: new Date(),
      }),
    },
    {
      label: "Last 7 Days",
      getValue: () => ({
        from: subDays(new Date(), 6),
        to: new Date(),
      }),
    },
    {
      label: "This Week",
      getValue: () => ({
        from: startOfWeek(new Date()),
        to: endOfWeek(new Date()),
      }),
    },
    {
      label: "This Month",
      getValue: () => ({
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date()),
      }),
    },
    {
      label: "Last 30 Days",
      getValue: () => ({
        from: subDays(new Date(), 29),
        to: new Date(),
      }),
    },
  ]

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal rounded-xl",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "LLL dd, y")} -{" "}
                  {format(value.to, "LLL dd, y")}
                </>
              ) : (
                format(value.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            <div className="border-r p-3 space-y-1">
              <div className="text-sm font-medium mb-2">Presets</div>
              {presets.map((preset) => (
                <Button
                  key={preset.label}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start font-normal"
                  onClick={() => {
                    onChange(preset.getValue())
                    setIsOpen(false)
                  }}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
            <div className="p-3">
              <div className="text-sm font-medium mb-2">Custom Range</div>
              <div className="space-y-2">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">From</div>
                  <Calendar
                    mode="single"
                    selected={value?.from}
                    onSelect={(date) => date && onChange({ ...value, from: date })}
                  />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">To</div>
                  <Calendar
                    mode="single"
                    selected={value?.to}
                    onSelect={(date) => date && onChange({ ...value, to: date })}
                  />
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
