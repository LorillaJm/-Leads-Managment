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

interface AppleSalesTableProps {
  data: SalesConsultant[]
}

type SortKey = keyof Omit<SalesConsultant, 'id' | 'name'>
type SortDirection = 'asc' | 'desc'

export function AppleSalesTable({ data }: AppleSalesTableProps) {
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
    <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-[0_1px_2px_0_rgb(0_0_0_/0.05)] overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="bg-[#2563EB] px-4 py-3 flex items-center justify-between">
        <h3 className="text-xs font-semibold text-white tracking-tight">Sales Team</h3>
        <span className="text-[10px] text-white/80 font-medium">
          Count: {data.length}
        </span>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <table className="w-full">
            <thead className="bg-[#2563EB] sticky top-0 z-10">
              <tr>
                <th className="px-3 py-2 text-left text-[9px] font-semibold text-white uppercase tracking-wider">
                  Sales Consultant
                </th>
                <th 
                  className="px-2 py-2 text-center text-[9px] font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-[#1D4ED8] transition-colors"
                  onClick={() => handleSort('leads')}
                >
                  <div className="flex items-center justify-center gap-1">
                    L
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  className="px-2 py-2 text-center text-[9px] font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-[#1D4ED8] transition-colors"
                  onClick={() => handleSort('prospects')}
                >
                  <div className="flex items-center justify-center gap-1">
                    P
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  className="px-2 py-2 text-center text-[9px] font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-[#1D4ED8] transition-colors"
                  onClick={() => handleSort('testDrives')}
                >
                  <div className="flex items-center justify-center gap-1">
                    T
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  className="px-2 py-2 text-center text-[9px] font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-[#1D4ED8] transition-colors"
                  onClick={() => handleSort('reservations')}
                >
                  <div className="flex items-center justify-center gap-1">
                    R
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  className="px-2 py-2 text-center text-[9px] font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-[#1D4ED8] transition-colors"
                  onClick={() => handleSort('bankApplications')}
                >
                  <div className="flex items-center justify-center gap-1">
                    B
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  className="px-2 py-2 text-center text-[9px] font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-[#1D4ED8] transition-colors"
                  onClick={() => handleSort('closedDeals')}
                >
                  <div className="flex items-center justify-center gap-1">
                    C
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F5]">
              {sortedData.map((consultant) => (
                <tr 
                  key={consultant.id} 
                  className="hover:bg-[#FAFAFA] transition-colors"
                >
                  <td className="px-3 py-2 text-[10px] text-[#171717] font-medium">
                    {consultant.name}
                  </td>
                  <td className="px-2 py-2 text-[10px] text-center text-[#757575] font-medium">
                    {consultant.leads}
                  </td>
                  <td className="px-2 py-2 text-[10px] text-center text-[#757575] font-medium">
                    {consultant.prospects}
                  </td>
                  <td className="px-2 py-2 text-[10px] text-center text-[#757575] font-medium">
                    {consultant.testDrives}
                  </td>
                  <td className="px-2 py-2 text-[10px] text-center text-[#757575] font-medium">
                    {consultant.reservations}
                  </td>
                  <td className="px-2 py-2 text-[10px] text-center text-[#757575] font-medium">
                    {consultant.bankApplications}
                  </td>
                  <td className="px-2 py-2 text-[10px] text-center text-[#757575] font-medium">
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
