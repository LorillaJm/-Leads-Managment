import { motion } from 'framer-motion'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface SalesConsultantData {
  id: string
  name: string
  leads: number
  prospects: number
  testDrives: number
  reservations: number
  bankApplications: number
  closedDeals: number
}

interface SalesTeamTableProps {
  data: SalesConsultantData[]
  totalCount: number
}

type SortField = keyof Omit<SalesConsultantData, 'id' | 'name'>
type SortDirection = 'asc' | 'desc'

export function SalesTeamTable({ data, totalCount }: SalesTeamTableProps) {
  const [sortField, setSortField] = useState<SortField>('leads')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]
    return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
  })

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-2.5 h-2.5" />
    ) : (
      <ChevronDown className="w-2.5 h-2.5" />
    )
  }

  // Prepare chart data - top 10 consultants
  const chartData = sortedData.slice(0, 10).map(consultant => ({
    name: consultant.name.split(' ')[0], // First name only for chart
    Leads: consultant.leads,
    Prospects: consultant.prospects,
    'Test Drives': consultant.testDrives,
    Reservations: consultant.reservations,
    'Bank Applications': consultant.bankApplications,
    'Closed Deals': consultant.closedDeals,
  }))

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 overflow-hidden shadow-lg"
      style={{
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div className="bg-blue-600 text-white px-3 py-2 flex items-center justify-between">
        <h3 className="text-sm lg:text-base font-bold">Sales Team</h3>
        <div className="flex items-center gap-1.5">
          <button className="p-1 bg-blue-700 rounded hover:bg-blue-800 transition-colors">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
          </button>
          <button className="p-1 bg-blue-700 rounded hover:bg-blue-800 transition-colors">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <div className="px-3 py-1.5 bg-gray-50 border-b border-gray-200 text-right">
        <span className="text-xs text-gray-600">Count: {totalCount}</span>
      </div>

      <div className="overflow-x-auto max-h-64 overflow-y-auto">
        <table className="w-full">
          <thead className="bg-blue-600 text-white sticky top-0 z-10">
            <tr>
              <th className="px-2 py-1.5 text-left text-[10px] font-semibold">
                <button className="flex items-center gap-0.5 hover:text-blue-100">
                  Sales Consultant
                  <ChevronDown className="w-2.5 h-2.5" />
                </button>
              </th>
              <th className="px-2 py-1.5 text-center text-[10px] font-semibold">
                <button
                  onClick={() => handleSort('leads')}
                  className="flex items-center gap-0.5 hover:text-blue-100 mx-auto"
                >
                  Leads
                  <SortIcon field="leads" />
                </button>
              </th>
              <th className="px-2 py-1.5 text-center text-[10px] font-semibold">
                <button
                  onClick={() => handleSort('prospects')}
                  className="flex items-center gap-0.5 hover:text-blue-100 mx-auto"
                >
                  Prospects
                  <SortIcon field="prospects" />
                </button>
              </th>
              <th className="px-2 py-1.5 text-center text-[10px] font-semibold">
                <button
                  onClick={() => handleSort('testDrives')}
                  className="flex items-center gap-0.5 hover:text-blue-100 mx-auto"
                >
                  Test Drv
                  <SortIcon field="testDrives" />
                </button>
              </th>
              <th className="px-2 py-1.5 text-center text-[10px] font-semibold">
                <button
                  onClick={() => handleSort('reservations')}
                  className="flex items-center gap-0.5 hover:text-blue-100 mx-auto"
                >
                  Reserv
                  <SortIcon field="reservations" />
                </button>
              </th>
              <th className="px-2 py-1.5 text-center text-[10px] font-semibold">
                <button
                  onClick={() => handleSort('bankApplications')}
                  className="flex items-center gap-0.5 hover:text-blue-100 mx-auto"
                >
                  Bank
                  <SortIcon field="bankApplications" />
                </button>
              </th>
              <th className="px-2 py-1.5 text-center text-[10px] font-semibold">
                <button
                  onClick={() => handleSort('closedDeals')}
                  className="flex items-center gap-0.5 hover:text-blue-100 mx-auto"
                >
                  Closed
                  <SortIcon field="closedDeals" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedData.map((consultant, index) => (
              <motion.tr
                key={consultant.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className="hover:bg-gray-50"
              >
                <td className="px-2 py-1.5 text-xs text-gray-900">
                  {consultant.name}
                </td>
                <td className="px-2 py-1.5 text-xs text-center text-gray-900">
                  {consultant.leads}
                </td>
                <td className="px-2 py-1.5 text-xs text-center text-gray-900">
                  {consultant.prospects}
                </td>
                <td className="px-2 py-1.5 text-xs text-center text-gray-900">
                  {consultant.testDrives}
                </td>
                <td className="px-2 py-1.5 text-xs text-center text-gray-900">
                  {consultant.reservations}
                </td>
                <td className="px-2 py-1.5 text-xs text-center text-gray-900">
                  {consultant.bankApplications}
                </td>
                <td className="px-2 py-1.5 text-xs text-center text-gray-900">
                  {consultant.closedDeals}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chart Section */}
      <div className="p-4 border-t border-gray-200 bg-gray-50/50">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '11px'
              }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '10px' }}
              iconSize={10}
            />
            <Bar dataKey="Leads" fill="#3b82f6" />
            <Bar dataKey="Prospects" fill="#10b981" />
            <Bar dataKey="Test Drives" fill="#f59e0b" />
            <Bar dataKey="Reservations" fill="#ef4444" />
            <Bar dataKey="Bank Applications" fill="#8b5cf6" />
            <Bar dataKey="Closed Deals" fill="#06b6d4" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
