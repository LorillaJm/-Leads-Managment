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
      className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
    >
      {/* Scope Header */}
      <div className="bg-gradient-to-r from-gray-50 to-white px-4 py-2.5 border-b border-gray-200">
        <h3 className="text-sm font-bold text-gray-900">Scope</h3>
      </div>

      <div className="p-3">
        {/* Year Filter */}
        <div className="mb-3">
          <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
            Year
          </label>
          <Select value={selectedYear} onValueChange={onYearChange}>
            <SelectTrigger className="w-full h-9 text-sm bg-gradient-to-r from-cyan-400 to-cyan-500 text-white border-0 hover:from-cyan-500 hover:to-cyan-600 shadow-sm font-medium">
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
        <div className="space-y-0.5 mb-4">
          {MONTHS.map((month) => (
            <label
              key={month}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-md transition-colors group"
            >
              <input
                type="checkbox"
                checked={selectedMonths.includes(month)}
                onChange={() => onMonthToggle(month)}
                className="w-3.5 h-3.5 rounded border-gray-300 text-cyan-500 focus:ring-cyan-500 focus:ring-2 cursor-pointer"
              />
              <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900">{month}</span>
            </label>
          ))}
        </div>

        {/* Sales Consultant Filter */}
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
            Sales Consultant
          </label>
          <Select value={selectedConsultant} onValueChange={onConsultantChange}>
            <SelectTrigger className="w-full h-9 text-sm bg-gradient-to-r from-cyan-400 to-cyan-500 text-white border-0 hover:from-cyan-500 hover:to-cyan-600 shadow-sm font-medium">
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
      </div>
    </motion.div>
  )
}
