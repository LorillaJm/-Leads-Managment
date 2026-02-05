import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface EnterpriseConversionPanelProps {
  leadsToProspects: number
  prospectsToClosedDeals: number
  leadsToProspectsGoal?: number
  prospectsToClosedDealsGoal?: number
}

export function EnterpriseConversionPanel({
  leadsToProspects,
  prospectsToClosedDeals,
  leadsToProspectsGoal = 20,
  prospectsToClosedDealsGoal = 25,
}: EnterpriseConversionPanelProps) {
  const chartData = [
    { name: 'Leads', value: 1.0 },
    { name: 'Prospects', value: leadsToProspects / 100 },
    { name: 'Closed', value: (prospectsToClosedDeals / 100) * (leadsToProspects / 100) },
  ]

  return (
    <div className="bg-white rounded-[10px] border border-[#E5E7EB] shadow-[0_1px_2px_0_rgb(0_0_0_/0.03)] h-full overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-[#F9FAFB] px-4 py-3 border-b border-[#E5E7EB]">
        <h3 className="text-[13px] font-semibold text-[#111827]">Conversion Flow</h3>
        <p className="text-[10px] text-[#6B7280] mt-0.5">By Leads, Prospects, and Closed Deals</p>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col">
        {/* Chart - 200px height, wide aspect */}
        <div className="h-[200px] mb-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 11, fill: '#6B7280' }}
                stroke="#E5E7EB"
                tickLine={false}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: '#6B7280' }}
                stroke="#E5E7EB"
                tickLine={false}
                axisLine={{ stroke: '#E5E7EB' }}
                domain={[-0.1, 1.1]}
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '10px',
                  fontSize: '11px',
                  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.05)',
                  padding: '8px 12px'
                }}
                formatter={(value: any) => [`${(value * 100).toFixed(1)}%`, 'Rate']}
                labelStyle={{ color: '#111827', fontWeight: 600, fontSize: '11px' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6', r: 4, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Conversion Rate Cards - Flat, compact */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-[10px] p-3 h-[60px] flex flex-col justify-center">
            <div className="text-[10px] text-[#6B7280] mb-1 font-medium uppercase tracking-wide">
              Leads → Prospects
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[18px] font-semibold text-[#111827]">
                {leadsToProspects}%
              </span>
              <span className="text-[10px] text-[#9CA3AF]">
                Goal: {leadsToProspectsGoal}%
              </span>
            </div>
          </div>

          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-[10px] p-3 h-[60px] flex flex-col justify-center">
            <div className="text-[10px] text-[#6B7280] mb-1 font-medium uppercase tracking-wide">
              Prospects → Closed
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[18px] font-semibold text-[#111827]">
                {prospectsToClosedDeals}%
              </span>
              <span className="text-[10px] text-[#9CA3AF]">
                Goal: {prospectsToClosedDealsGoal}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
