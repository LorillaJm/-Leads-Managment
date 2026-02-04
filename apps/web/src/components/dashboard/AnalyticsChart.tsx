import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface AnalyticsChartProps {
  data: Array<{
    consultant: string
    leads: number
    prospects: number
    testDrives: number
    reservations: number
    bankApplications: number
    closedDeals: number
  }>
}

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-lg border border-gray-200 p-6"
    >
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        Performance Analytics
      </h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="consultant" 
              tick={{ fontSize: 11 }}
              stroke="#9ca3af"
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              tick={{ fontSize: 11 }}
              stroke="#9ca3af"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
              iconType="circle"
            />
            <Bar dataKey="leads" fill="#f59e0b" name="Leads" />
            <Bar dataKey="prospects" fill="#3b82f6" name="Prospects" />
            <Bar dataKey="testDrives" fill="#06b6d4" name="Test Drives" />
            <Bar dataKey="reservations" fill="#8b5cf6" name="Reservations" />
            <Bar dataKey="bankApplications" fill="#ec4899" name="Bank Applications" />
            <Bar dataKey="closedDeals" fill="#10b981" name="Closed Deals" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
