import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ConversionFlowPanelProps {
  leadsToProspects: number
  prospectsToClosedDeals: number
  leadsToProspectsGoal?: number
  prospectsToClosedDealsGoal?: number
}

export function ConversionFlowPanel({
  leadsToProspects,
  prospectsToClosedDeals,
  leadsToProspectsGoal = 20,
  prospectsToClosedDealsGoal = 25,
}: ConversionFlowPanelProps) {
  const data = [
    { name: 'Leads', value: 1.0 },
    { name: 'Prospects', value: leadsToProspects / 100 },
    { name: 'Closed Deals', value: (leadsToProspects / 100) * (prospectsToClosedDeals / 100) },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-4 shadow-lg h-full"
      style={{
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }}
    >
      <h3 className="text-base font-bold text-gray-900 mb-2">Conversion Flow</h3>
      
      <div className="space-y-3">
        <div className="text-sm text-gray-600">
          By Leads, Prospects, and Closed Deals
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="border border-gray-200/50 rounded-xl p-3 bg-white/50 backdrop-blur-sm">
            <div className="text-xs text-gray-600 mb-1">Leads → Prospects</div>
            <div className="text-2xl font-bold text-gray-900">
              {leadsToProspects}%
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Goal: {leadsToProspectsGoal}%
            </div>
          </div>

          <div className="border border-gray-200/50 rounded-xl p-3 bg-white/50 backdrop-blur-sm">
            <div className="text-xs text-gray-600 mb-1">Prospects → Closed Deals</div>
            <div className="text-2xl font-bold text-gray-900">
              {prospectsToClosedDeals}%
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Goal: {prospectsToClosedDealsGoal}%
            </div>
          </div>
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 11 }}
                stroke="#9ca3af"
              />
              <YAxis 
                tick={{ fontSize: 11 }}
                stroke="#9ca3af"
                domain={[-1, 1]}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
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
      </div>
    </motion.div>
  )
}
