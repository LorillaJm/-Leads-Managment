import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ConversionFlowPanelProps {
  leadsToProspects: number
  prospectsToClosedDeals: number
  leadsToProspectsGoal?: number
  prospectsToClosedDealsGoal?: number
  testDrives?: number
  reservations?: number
  testDrivesMin?: number
  reservationsMin?: number
  bankApplications?: number
  bankApplicationsMin?: number
}

export function ConversionFlowPanel({
  leadsToProspects,
  prospectsToClosedDeals,
  leadsToProspectsGoal = 20,
  prospectsToClosedDealsGoal = 25,
  testDrives = 0,
  reservations = 0,
  testDrivesMin = 300,
  reservationsMin = 120,
  bankApplications = 0,
  bankApplicationsMin = 180,
}: ConversionFlowPanelProps) {
  const data = [
    { name: 'Leads', value: 1.0 },
    { name: 'Prospects', value: leadsToProspects / 100 },
    { name: 'Closed Deals', value: (prospectsToClosedDeals / 100) * (leadsToProspects / 100) },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-lg border border-gray-300 shadow-sm h-full flex flex-col"
    >
      <div className="bg-gray-100 px-2.5 py-1.5 border-b border-gray-300">
        <h3 className="text-xs font-bold text-gray-900">Conversion Flow</h3>
        <div className="text-[10px] text-gray-600 mt-0.5">By Leads, Prospects, and Closed Deals</div>
      </div>
      
      <div className="p-2 flex-1 flex flex-col">
        {/* Main Conversion Chart */}
        <div className="flex-1 min-h-[140px] mb-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 10 }}
                stroke="#9ca3af"
              />
              <YAxis 
                tick={{ fontSize: 10 }}
                stroke="#9ca3af"
                domain={[-0.2, 1.2]}
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '11px'
                }}
                formatter={(value: any) => `${(value * 100).toFixed(1)}%`}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Conversion Rates */}
        <div className="grid grid-cols-2 gap-1.5 mb-2">
          <div className="border border-gray-200 rounded p-1.5 bg-gray-50">
            <div className="text-[9px] text-gray-600 mb-0.5">Leads → Prospects</div>
            <div className="text-lg font-bold text-gray-900">
              {leadsToProspects}%
            </div>
            <div className="text-[9px] text-gray-500 mt-0.5">
              Goal: {leadsToProspectsGoal}%
            </div>
          </div>

          <div className="border border-gray-200 rounded p-1.5 bg-gray-50">
            <div className="text-[9px] text-gray-600 mb-0.5">Prospects → Closed Deals</div>
            <div className="text-lg font-bold text-gray-900">
              {prospectsToClosedDeals}%
            </div>
            <div className="text-[9px] text-gray-500 mt-0.5">
              Goal: {prospectsToClosedDealsGoal}%
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="space-y-1 pt-1.5 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-gray-600 font-medium">Test Drives</span>
            <div className="text-right">
              <div className="text-sm font-bold text-gray-900">{testDrives}</div>
              <div className="text-[9px] text-gray-500">Minimum: {testDrivesMin}</div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[10px] text-gray-600 font-medium">Reservations</span>
            <div className="text-right">
              <div className="text-sm font-bold text-gray-900">{reservations}</div>
              <div className="text-[9px] text-gray-500">Minimum: {reservationsMin}</div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[10px] text-gray-600 font-medium">Bank Applications</span>
            <div className="text-right">
              <div className="text-sm font-bold text-gray-900">{bankApplications}</div>
              <div className="text-[9px] text-gray-500">Minimum: {bankApplicationsMin}</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
