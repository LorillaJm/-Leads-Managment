import { Calendar, Users } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface PremiumFilterPanelProps {
  selectedYear: string
  selectedMonths: string[]
  selectedConsultant: string
  years: string[]
  months: string[]
  consultants: any[]
  onYearChange: (year: string) => void
  onMonthToggle: (month: string) => void
  onConsultantChange: (consultant: string) => void
}

export function PremiumFilterPanel({
  selectedYear,
  selectedMonths,
  selectedConsultant,
  years,
  months,
  consultants,
  onYearChange,
  onMonthToggle,
  onConsultantChange,
}: PremiumFilterPanelProps) {
  return (
    <div className="h-full p-6 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-sm font-semibold text-slate-900 mb-1">Filters</h2>
        <p className="text-xs text-slate-500">Refine your view</p>
      </div>

      {/* Year Selector */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
          <Calendar className="w-3.5 h-3.5" />
          <span>Year</span>
        </div>
        <Select value={selectedYear} onValueChange={onYearChange}>
          <SelectTrigger className="w-full h-9 bg-white border-slate-200/60 rounded-lg text-sm font-medium hover:border-blue-500/40 transition-colors">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year} className="text-sm">
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Month Checkboxes */}
      <div className="space-y-3">
        <div className="text-xs font-medium text-slate-700">Months</div>
        <div className="space-y-1.5 max-h-64 overflow-y-auto pr-2">
          {months.map((month) => (
            <label
              key={month}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-slate-100/50 cursor-pointer transition-colors group"
            >
              <input
                type="checkbox"
                checked={selectedMonths.includes(month)}
                onChange={() => onMonthToggle(month)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0 transition-all"
              />
              <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600 transition-colors">
                {month}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Sales Consultant Selector */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
          <Users className="w-3.5 h-3.5" />
          <span>Sales Consultant</span>
        </div>
        <Select value={selectedConsultant} onValueChange={onConsultantChange}>
          <SelectTrigger className="w-full h-9 bg-white border-slate-200/60 rounded-lg text-sm font-medium hover:border-blue-500/40 transition-colors">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL" className="text-sm">All Consultants</SelectItem>
            {consultants.map((c: any) => (
              <SelectItem key={c.id} value={c.id} className="text-sm">
                {c.fullName || `${c.firstName} ${c.lastName}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
