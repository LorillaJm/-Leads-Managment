import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

interface MonthlyData {
  month: string
  leads: number
  prospects: number
  testDrives: number
  reservations: number
  bankApplications: number
  closedDeals: number
}

interface MonthlyDataTableProps {
  data: MonthlyData[]
}

export function MonthlyDataTable({ data }: MonthlyDataTableProps) {
  const [sortColumn, setSortColumn] = useState<keyof MonthlyData | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const handleSort = (column: keyof MonthlyData) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('desc')
    }
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn) return 0
    const aVal = a[sortColumn]
    const bVal = b[sortColumn]
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    }
    
    return sortDirection === 'asc' ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal)
  })

  const totals = data.reduce((acc, row) => ({
    leads: acc.leads + row.leads,
    prospects: acc.prospects + row.prospects,
    testDrives: acc.testDrives + row.testDrives,
    reservations: acc.reservations + row.reservations,
    bankApplications: acc.bankApplications + row.bankApplications,
    closedDeals: acc.closedDeals + row.closedDeals,
  }), { leads: 0, prospects: 0, testDrives: 0, reservations: 0, bankApplications: 0, closedDeals: 0 })

  const SortIcon = ({ column }: { column: keyof MonthlyData }) => {
    if (sortColumn !== column) return <ChevronDown className="w-4 h-4 opacity-30" />
    return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
  }

  return (
    <div className="rounded-lg border border-border/50 overflow-hidden bg-background/40">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th 
                className="px-4 py-3 text-left font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
                onClick={() => handleSort('month')}
              >
                <div className="flex items-center gap-2">
                  Month
                  <SortIcon column="month" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-center font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
                onClick={() => handleSort('leads')}
              >
                <div className="flex items-center justify-center gap-2">
                  Leads
                  <SortIcon column="leads" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-center font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
                onClick={() => handleSort('prospects')}
              >
                <div className="flex items-center justify-center gap-2">
                  Prospects
                  <SortIcon column="prospects" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-center font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
                onClick={() => handleSort('testDrives')}
              >
                <div className="flex items-center justify-center gap-2">
                  Test Drives
                  <SortIcon column="testDrives" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-center font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
                onClick={() => handleSort('reservations')}
              >
                <div className="flex items-center justify-center gap-2">
                  Reservations
                  <SortIcon column="reservations" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-center font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
                onClick={() => handleSort('bankApplications')}
              >
                <div className="flex items-center justify-center gap-2">
                  Bank Apps
                  <SortIcon column="bankApplications" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-center font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
                onClick={() => handleSort('closedDeals')}
              >
                <div className="flex items-center justify-center gap-2">
                  Closed
                  <SortIcon column="closedDeals" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => (
              <motion.tr
                key={row.month}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.02 }}
                className="border-b border-border/30 hover:bg-muted/20 transition-colors"
              >
                <td className="px-4 py-3 font-medium">{row.month}</td>
                <td className="px-4 py-3 text-center">{row.leads}</td>
                <td className="px-4 py-3 text-center">{row.prospects}</td>
                <td className="px-4 py-3 text-center">{row.testDrives}</td>
                <td className="px-4 py-3 text-center">{row.reservations}</td>
                <td className="px-4 py-3 text-center">{row.bankApplications}</td>
                <td className="px-4 py-3 text-center font-semibold text-emerald-600 dark:text-emerald-400">
                  {row.closedDeals}
                </td>
              </motion.tr>
            ))}
            <tr className="bg-blue-600 text-white font-bold">
              <td className="px-4 py-3">YEAR END</td>
              <td className="px-4 py-3 text-center">{totals.leads}</td>
              <td className="px-4 py-3 text-center">{totals.prospects}</td>
              <td className="px-4 py-3 text-center">{totals.testDrives}</td>
              <td className="px-4 py-3 text-center">{totals.reservations}</td>
              <td className="px-4 py-3 text-center">{totals.bankApplications}</td>
              <td className="px-4 py-3 text-center">{totals.closedDeals}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
