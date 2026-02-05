import { useState } from 'react'
import { ArrowUpDown } from 'lucide-react'

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

interface EnterpriseSalesTableProps {
  data: SalesConsultant[]
}

type SortKey = keyof Omit<SalesConsultant, 'id' | 'name'>
type SortDirection = 'asc' | 'desc'

export function EnterpriseSalesTable({ data }: EnterpriseSalesTableProps) {
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
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

  return (
    <div className="bg-white rounded-[10px] border border-[#E5E7EB] shadow-[0_1px_2px_0_rgb(0_0_0_/0.03)] overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="bg-[#1F2937] px-4 py-3 flex items-center justify-between">
        <h3 className="text-[13px] font-semibold text-white">Sales Team</h3>
        <span className="text-[10px] text-white/80 font-medium">
          Count: {data.length}
        </span>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <table className="w-full">
            <thead className="bg-[#1F2937] sticky top-0 z-10">
              <tr>
                <th className="px-3 py-2 text-left text-[10px] font-semibold text-white uppercase tracking-wider">
                  Name
                </th>
                <th 
                  className="px-2 py-2 text-center text-[10px] font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-[#374151] transition-colors"
                  onClick={() => handleSort('leads')}
                >
                  <div className="flex items-center justify-center gap-1">
                    L
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  className="px-2 py-2 text-center text-[10px] font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-[#374151] transition-colors"
                  onClick={() => handleSort('prospects')}
                >
                  <div className="flex items-center justify-center gap-1">
                    P
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  className="px-2 py-2 text-center text-[10px] font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-[#374151] transition-colors"
                  onClick={() => handleSort('testDrives')}
                >
                  <div className="flex items-center justify-center gap-1">
                    T
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  className="px-2 py-2 text-center text-[10px] font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-[#374151] transition-colors"
                  onClick={() => handleSort('reservations')}
                >
                  <div className="flex items-center justify-center gap-1">
                    R
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  className="px-2 py-2 text-center text-[10px] font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-[#374151] transition-colors"
                  onClick={() => handleSort('bankApplications')}
                >
                  <div className="flex items-center justify-center gap-1">
                    B
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  className="px-2 py-2 text-center text-[10px] font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-[#374151] transition-colors"
                  onClick={() => handleSort('closedDeals')}
                >
                  <div className="flex items-center justify-center gap-1">
                    C
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {sortedData.map((consultant) => (
                <tr 
                  key={consultant.id} 
                  className="hover:bg-[#F9FAFB] transition-colors h-[36px]"
                >
                  <td className="px-3 py-2 text-[11px] text-[#111827] font-medium">
                    {consultant.name}
                  </td>
                  <td className="px-2 py-2 text-[11px] text-center text-[#6B7280] font-medium">
                    {consultant.leads}
                  </td>
                  <td className="px-2 py-2 text-[11px] text-center text-[#6B7280] font-medium">
                    {consultant.prospects}
                  </td>
                  <td className="px-2 py-2 text-[11px] text-center text-[#6B7280] font-medium">
                    {consultant.testDrives}
                  </td>
                  <td className="px-2 py-2 text-[11px] text-center text-[#6B7280] font-medium">
                    {consultant.reservations}
                  </td>
                  <td className="px-2 py-2 text-[11px] text-center text-[#6B7280] font-medium">
                    {consultant.bankApplications}
                  </td>
                  <td className="px-2 py-2 text-[11px] text-center text-[#6B7280] font-medium">
                    {consultant.closedDeals}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
