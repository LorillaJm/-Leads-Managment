import { useState } from 'react'
import { ArrowUpDown, Users, TrendingUp, Car, FileText, Building2, CheckCircle2 } from 'lucide-react'

interface SalesConsultant {
  id: string
  name: string
  leads: number
  prospects: number
  testDrives: number
  reservations: number
  bankApplications: number
  closedDeals: number
}

interface PremiumSalesTableProps {
  data: SalesConsultant[]
}

type SortKey = keyof Omit<SalesConsultant, 'id' | 'name'>
type SortDirection = 'asc' | 'desc'

export function PremiumSalesTable({ data }: PremiumSalesTableProps) {
  const [sortKey, setSortKey] = useState<SortKey | null>('closedDeals')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('desc')
    }
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0
    const aValue = a[sortKey]
    const bValue = b[sortKey]
    const multiplier = sortDirection === 'asc' ? 1 : -1
    return (aValue - bValue) * multiplier
  })

  const columnIcons = {
    leads: Users,
    prospects: TrendingUp,
    testDrives: Car,
    reservations: FileText,
    bankApplications: Building2,
    closedDeals: CheckCircle2,
  }

  return (
    <div className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white mb-0.5">Sales Team</h3>
            <p className="text-xs text-slate-300">Performance by consultant</p>
          </div>
          <div className="text-xs font-medium text-slate-300">
            {data.length} consultants
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50/50 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Consultant
              </th>
              {Object.entries(columnIcons).map(([key, Icon]) => (
                <th 
                  key={key}
                  className="px-3 py-3 text-center cursor-pointer hover:bg-slate-100/50 transition-colors group"
                  onClick={() => handleSort(key as SortKey)}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <Icon className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-600 transition-colors" />
                    <ArrowUpDown className="w-3 h-3 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedData.map((consultant, index) => (
              <tr 
                key={consultant.id} 
                className="hover:bg-slate-50/50 transition-colors group"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white text-xs font-semibold">
                      {consultant.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900">{consultant.name}</div>
                      <div className="text-xs text-slate-500">Rank #{index + 1}</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 text-center">
                  <span className="inline-flex items-center justify-center min-w-[32px] h-7 px-2 rounded-lg bg-slate-100 text-sm font-semibold text-slate-700 group-hover:bg-slate-200 transition-colors">
                    {consultant.leads}
                  </span>
                </td>
                <td className="px-3 py-3 text-center">
                  <span className="inline-flex items-center justify-center min-w-[32px] h-7 px-2 rounded-lg bg-blue-100 text-sm font-semibold text-blue-700 group-hover:bg-blue-200 transition-colors">
                    {consultant.prospects}
                  </span>
                </td>
                <td className="px-3 py-3 text-center">
                  <span className="inline-flex items-center justify-center min-w-[32px] h-7 px-2 rounded-lg bg-violet-100 text-sm font-semibold text-violet-700 group-hover:bg-violet-200 transition-colors">
                    {consultant.testDrives}
                  </span>
                </td>
                <td className="px-3 py-3 text-center">
                  <span className="inline-flex items-center justify-center min-w-[32px] h-7 px-2 rounded-lg bg-indigo-100 text-sm font-semibold text-indigo-700 group-hover:bg-indigo-200 transition-colors">
                    {consultant.reservations}
                  </span>
                </td>
                <td className="px-3 py-3 text-center">
                  <span className="inline-flex items-center justify-center min-w-[32px] h-7 px-2 rounded-lg bg-amber-100 text-sm font-semibold text-amber-700 group-hover:bg-amber-200 transition-colors">
                    {consultant.bankApplications}
                  </span>
                </td>
                <td className="px-3 py-3 text-center">
                  <span className="inline-flex items-center justify-center min-w-[32px] h-7 px-2 rounded-lg bg-emerald-100 text-sm font-semibold text-emerald-700 group-hover:bg-emerald-200 transition-colors">
                    {consultant.closedDeals}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
