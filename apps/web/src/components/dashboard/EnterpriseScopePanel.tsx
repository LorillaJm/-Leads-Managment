import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface EnterpriseScopePanelProps {
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

export function EnterpriseScopePanel({
  selectedYear,
  selectedMonths,
  selectedConsultant,
  years,
  months,
  consultants,
  onYearChange,
  onMonthToggle,
  onConsultantChange,
}: EnterpriseScopePanelProps) {
  return (
    <div className="bg-white rounded-[10px] border border-[#E5E7EB] shadow-[0_1px_2px_0_rgb(0_0_0_/0.03)] h-full overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-[#F9FAFB] px-4 py-3 border-b border-[#E5E7EB]">
        <h3 className="text-[13px] font-semibold text-[#111827]">Scope</h3>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Year Selector */}
        <div>
          <label className="block text-[10px] font-medium text-[#6B7280] mb-2 uppercase tracking-wide">
            Year
          </label>
          <Select value={selectedYear} onValueChange={onYearChange}>
            <SelectTrigger className="w-full h-8 bg-[#3B82F6] hover:bg-[#2563EB] text-white border-0 rounded-md text-[11px] font-medium transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year} className="text-[11px]">
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Month Checkboxes */}
        <div>
          <label className="block text-[10px] font-medium text-[#6B7280] mb-2 uppercase tracking-wide">
            Months
          </label>
          <div className="space-y-1">
            {months.map((month) => (
              <label
                key={month}
                className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-[#F9FAFB] cursor-pointer transition-colors group"
              >
                <input
                  type="checkbox"
                  checked={selectedMonths.includes(month)}
                  onChange={() => onMonthToggle(month)}
                  className="w-3.5 h-3.5 rounded border-[#D1D5DB] text-[#3B82F6] focus:ring-[#3B82F6] focus:ring-offset-0 focus:ring-2 transition-all"
                />
                <span className="text-[11px] font-medium text-[#111827] group-hover:text-[#3B82F6] transition-colors">
                  {month}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Sales Consultant Selector */}
        <div>
          <label className="block text-[10px] font-medium text-[#6B7280] mb-2 uppercase tracking-wide">
            Sales Consultant
          </label>
          <Select value={selectedConsultant} onValueChange={onConsultantChange}>
            <SelectTrigger className="w-full h-8 bg-[#3B82F6] hover:bg-[#2563EB] text-white border-0 rounded-md text-[11px] font-medium transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" className="text-[11px]">ALL</SelectItem>
              {consultants.map((c: any) => (
                <SelectItem key={c.id} value={c.id} className="text-[11px]">
                  {c.fullName || `${c.firstName} ${c.lastName}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
