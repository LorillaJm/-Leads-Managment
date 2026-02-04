import { motion } from 'framer-motion'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface FilterPanelProps {
  selectedYear: string
  selectedMonths: string[]
  selectedConsultant: string
  onYearChange: (year: string) => void
  onMonthToggle: (month: string) => void
  onConsultantChange: (consultant: string) => void
  salesConsultants: Array<{ id: string; name: string }>
}

const MONTHS = [
  'ALL', 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
]

const YEARS = ['2024', '2025', '2026']

export function FilterPanel({
  selectedYear,
  selectedMonths,
  selectedConsultant,
  onYearChange,
  onMonthToggle,
  onConsultantChange,
  salesConsultants,
}: FilterPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white border-r border-gray-200 p-4 space-y-6"
    >
      {/* Scope Header */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">Scope</h3>
        
        {/* Year Filter */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-gray-700 mb-2 block">
            Year
          </label>
          <Select value={selectedYear} onValueChange={onYearChange}>
            <SelectTrigger className="w-full h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Month Checkboxes */}
        <div className="space-y-1.5">
          {MONTHS.map((month) => (
            <label
              key={month}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
            >
              <input
                type="checkbox"
                checked={selectedMonths.includes(month)}
                onChange={() => onMonthToggle(month)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">{month}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sales Consultant Filter */}
      <div>
        <label className="text-xs font-semibold text-gray-700 mb-2 block">
          Sales Consultant
        </label>
        <Select value={selectedConsultant} onValueChange={onConsultantChange}>
          <SelectTrigger className="w-full h-9 text-sm bg-cyan-400 text-white border-cyan-500">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">ALL</SelectItem>
            {salesConsultants.map((consultant) => (
              <SelectItem key={consultant.id} value={consultant.id}>
                {consultant.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  )
}
