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
    <div className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-slate-900 to-slate-800 sticky top-0 z-10">
            <tr>
              <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-white uppercase tracking-wider">
                Consultant
              </th>
              {Object.entries(columnIcons).map(([key, Icon]) => (
                <th 
                  key={key}
                  className="px-2 py-2.5 text-center cursor-pointer hover:bg-slate-800 transition-colors group"
                  onClick={() => handleSort(key as SortKey)}
                >
                  <div className="flex items-center justify-center gap-1">
                    <Icon className="w-3 h-3 text-white/80 group-hover:text-white transition-colors" />
                    <ArrowUpDown className="w-2.5 h-2.5 text-white/60 group-hover:text-white transition-colors" />
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
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white text-[10px] font-semibold">
                      {consultant.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-900">{consultant.name}</div>
                      <div className="text-[10px] text-slate-500">#{index + 1}</div>
                    </div>
                  </div>
                </td>
                <td className="px-2 py-2.5 text-center">
                  <span className="inline-flex items-center justify-center min-w-[28px] h-6 px-1.5 rounded-md bg-slate-100 text-xs font-semibold text-slate-700 group-hover:bg-slate-200 transition-colors">
                    {consultant.leads}
                  </span>
                </td>
                <td className="px-2 py-2.5 text-center">
                  <span className="inline-flex items-center justify-center min-w-[28px] h-6 px-1.5 rounded-md bg-blue-100 text-xs font-semibold text-blue-700 group-hover:bg-blue-200 transition-colors">
                    {consultant.prospects}
                  </span>
                </td>
                <td className="px-2 py-2.5 text-center">
                  <span className="inline-flex items-center justify-center min-w-[28px] h-6 px-1.5 rounded-md bg-violet-100 text-xs font-semibold text-violet-700 group-hover:bg-violet-200 transition-colors">
                    {consultant.testDrives}
                  </span>
                </td>
                <td className="px-2 py-2.5 text-center">
                  <span className="inline-flex items-center justify-center min-w-[28px] h-6 px-1.5 rounded-md bg-indigo-100 text-xs font-semibold text-indigo-700 group-hover:bg-indigo-200 transition-colors">
                    {consultant.reservations}
                  </span>
                </td>
                <td className="px-2 py-2.5 text-center">
                  <span className="inline-flex items-center justify-center min-w-[28px] h-6 px-1.5 rounded-md bg-amber-100 text-xs font-semibold text-amber-700 group-hover:bg-amber-200 transition-colors">
                    {consultant.bankApplications}
                  </span>
                </td>
                <td className="px-2 py-2.5 text-center">
                  <span className="inline-flex items-center justify-center min-w-[28px] h-6 px-1.5 rounded-md bg-emerald-100 text-xs font-semibold text-emerald-700 group-hover:bg-emerald-200 transition-colors">
                    {consultant.closedDeals}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Performance Comparison Chart */}
      <div className="border-t border-slate-200 bg-slate-50/50 p-4">
        {/* Legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-amber-500"></div>
            <span className="text-[10px] font-medium text-slate-600">Leads</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-blue-500"></div>
            <span className="text-[10px] font-medium text-slate-600">Prospects</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-cyan-500"></div>
            <span className="text-[10px] font-medium text-slate-600">Test Drives</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-orange-500"></div>
            <span className="text-[10px] font-medium text-slate-600">Reservations</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-pink-500"></div>
            <span className="text-[10px] font-medium text-slate-600">Bank Applications</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-emerald-500"></div>
            <span className="text-[10px] font-medium text-slate-600">Closed Deals</span>
          </div>
        </div>

        {/* Horizontal Stacked Bar Chart */}
        <div className="space-y-2">
          {sortedData.map((consultant) => {
            const total = consultant.leads + consultant.prospects + consultant.testDrives + 
                         consultant.reservations + consultant.bankApplications + consultant.closedDeals
            
            return (
              <div key={consultant.id} className="flex items-center gap-2">
                <div className="w-32 text-[10px] text-slate-600 truncate text-right font-medium">
                  {consultant.name}
                </div>
                <div className="flex-1 h-6 bg-slate-200 rounded-full overflow-hidden flex">
                  {consultant.leads > 0 && (
                    <div 
                      className="bg-amber-500 h-full transition-all duration-500 hover:opacity-80"
                      style={{ width: `${(consultant.leads / total) * 100}%` }}
                      title={`Leads: ${consultant.leads}`}
                    />
                  )}
                  {consultant.prospects > 0 && (
                    <div 
                      className="bg-blue-500 h-full transition-all duration-500 hover:opacity-80"
                      style={{ width: `${(consultant.prospects / total) * 100}%` }}
                      title={`Prospects: ${consultant.prospects}`}
                    />
                  )}
                  {consultant.testDrives > 0 && (
                    <div 
                      className="bg-cyan-500 h-full transition-all duration-500 hover:opacity-80"
                      style={{ width: `${(consultant.testDrives / total) * 100}%` }}
                      title={`Test Drives: ${consultant.testDrives}`}
                    />
                  )}
                  {consultant.reservations > 0 && (
                    <div 
                      className="bg-orange-500 h-full transition-all duration-500 hover:opacity-80"
                      style={{ width: `${(consultant.reservations / total) * 100}%` }}
                      title={`Reservations: ${consultant.reservations}`}
                    />
                  )}
                  {consultant.bankApplications > 0 && (
                    <div 
                      className="bg-pink-500 h-full transition-all duration-500 hover:opacity-80"
                      style={{ width: `${(consultant.bankApplications / total) * 100}%` }}
                      title={`Bank Applications: ${consultant.bankApplications}`}
                    />
                  )}
                  {consultant.closedDeals > 0 && (
                    <div 
                      className="bg-emerald-500 h-full transition-all duration-500 hover:opacity-80"
                      style={{ width: `${(consultant.closedDeals / total) * 100}%` }}
                      title={`Closed Deals: ${consultant.closedDeals}`}
                    />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default PremiumSalesTable
