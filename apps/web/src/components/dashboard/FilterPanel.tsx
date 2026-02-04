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
      className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
    >
      {/* Scope Header */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Scope</h3>
        
        {/* Year Filter */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Year
          </label>
          <Select value={selectedYear} onValueChange={onYearChange}>
            <SelectTrigger className="w-full bg-cyan-400 text-white border-cyan-500 hover:bg-cyan-500">
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
        <div className="space-y-2 mb-6">
          {MONTHS.map((month) => (
            <label
              key={month}
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-2 py-1.5 rounded-lg transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedMonths.includes(month)}
                onChange={() => onMonthToggle(month)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-sm font-medium text-gray-700">{month}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sales Consultant Filter */}
      <div>
        <label className="text-sm font-semibold text-gray-700 mb-2 block">
          Sales Consultant
        </label>
        <Select value={selectedConsultant} onValueChange={onConsultantChange}>
          <SelectTrigger className="w-full bg-cyan-400 text-white border-cyan-500 hover:bg-cyan-500">
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
