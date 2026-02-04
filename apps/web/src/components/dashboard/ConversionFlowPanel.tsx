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
      className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-4 shadow-lg"
      style={{
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }}
    >
      <h3 className="text-sm lg:text-base font-bold text-gray-900 mb-2 lg:mb-3">Conversion Flow</h3>
      
      <div className="space-y-3">
        <div className="text-xs lg:text-sm text-gray-600">
          By Leads, Prospects, and Closed Deals
        </div>

        <div className="grid grid-cols-2 gap-2 lg:gap-3">
          <div className="border border-gray-200/50 rounded-xl p-2 lg:p-3 bg-white/50 backdrop-blur-sm">
            <div className="text-[10px] lg:text-xs text-gray-600 mb-0.5 lg:mb-1">Leads → Prospects</div>
            <div className="text-lg lg:text-xl font-bold text-gray-900">
              {leadsToProspects}%
            </div>
            <div className="text-[9px] lg:text-xs text-gray-500 mt-0.5">
              Goal: {leadsToProspectsGoal}%
            </div>
          </div>

          <div className="border border-gray-200/50 rounded-xl p-2 lg:p-3 bg-white/50 backdrop-blur-sm">
            <div className="text-[10px] lg:text-xs text-gray-600 mb-0.5 lg:mb-1">Prospects → Closed Deals</div>
            <div className="text-lg lg:text-xl font-bold text-gray-900">
              {prospectsToClosedDeals}%
            </div>
            <div className="text-[9px] lg:text-xs text-gray-500 mt-0.5">
              Goal: {prospectsToClosedDealsGoal}%
            </div>
          </div>
        </div>

        <div className="h-32 lg:h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 9 }}
                stroke="#9ca3af"
              />
              <YAxis 
                tick={{ fontSize: 9 }}
                stroke="#9ca3af"
                domain={[-1, 1]}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '11px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  )
}
