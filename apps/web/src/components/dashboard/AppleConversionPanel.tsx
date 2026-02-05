import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface AppleConversionPanelProps {
  leadsToProspects: number
  prospectsToClosedDeals: number
  testDrives: number
  reservations: number
  bankApplications: number
  leadsToProspectsGoal?: number
  prospectsToClosedDealsGoal?: number
  testDrivesMin?: number
  reservationsMin?: number
  bankApplicationsMin?: number
}

export function AppleConversionPanel({
  leadsToProspects,
  prospectsToClosedDeals,
  testDrives,
  reservations,
  bankApplications,
  leadsToProspectsGoal = 20,
  prospectsToClosedDealsGoal = 25,
  testDrivesMin = 300,
  reservationsMin = 120,
  bankApplicationsMin = 180,
}: AppleConversionPanelProps) {
  const chartData = [
    { name: 'Leads', value: 1.0 },
    { name: 'Prospects', value: leadsToProspects / 100 },
    { name: 'Closed Deals', value: (prospectsToClosedDeals / 100) * (leadsToProspects / 100) },
  ]

  return (
    <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-[0_1px_2px_0_rgb(0_0_0_/0.05)] overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="bg-[#F5F5F5] px-4 py-3 border-b border-[#E5E5E5]">
        <h3 className="text-xs font-semibold text-[#171717] tracking-tight">Conversion Flow</h3>
        <p className="text-[10px] text-[#757575] mt-0.5">By Leads, Prospects, and Closed Deals</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col">
        {/* Chart */}
        <div className="h-[180px] mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 10, fill: '#757575' }}
                stroke="#E5E5E5"
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 10, fill: '#757575' }}
                stroke="#E5E5E5"
                tickLine={false}
                domain={[-0.2, 1.2]}
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E5E5',
                  borderRadius: '12px',
                  fontSize: '12px',
                  boxShadow: '0 2px 8px 0 rgb(0 0 0 / 0.04)',
                  padding: '8px 12px'
                }}
                formatter={(value: any) => [`${(value * 100).toFixed(1)}%`, 'Conversion']}
                labelStyle={{ color: '#171717', fontWeight: 600 }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6', r: 5, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Conversion Rate Cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-[#F5F5F5] rounded-lg p-3 border border-[#E5E5E5]">
            <div className="text-[9px] text-[#757575] mb-1 font-medium uppercase tracking-wide">
              Leads → Prospects
            </div>
            <div className="text-lg font-semibold text-[#171717] tracking-tight">
              {leadsToProspects}%
            </div>
            <div className="text-[9px] text-[#757575] mt-1">
              Goal: {leadsToProspectsGoal}%
            </div>
          </div>

          <div className="bg-[#F5F5F5] rounded-lg p-3 border border-[#E5E5E5]">
            <div className="text-[9px] text-[#757575] mb-1 font-medium uppercase tracking-wide">
              Prospects → Closed
            </div>
            <div className="text-lg font-semibold text-[#171717] tracking-tight">
              {prospectsToClosedDeals}%
            </div>
            <div className="text-[9px] text-[#757575] mt-1">
              Goal: {prospectsToClosedDealsGoal}%
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="space-y-2 pt-3 border-t border-[#E5E5E5]">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-[#757575] font-medium">Test Drives</span>
            <div className="text-right">
              <div className="text-sm font-semibold text-[#171717]">{testDrives}</div>
              <div className="text-[9px] text-[#757575]">Min: {testDrivesMin}</div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[10px] text-[#757575] font-medium">Reservations</span>
            <div className="text-right">
              <div className="text-sm font-semibold text-[#171717]">{reservations}</div>
              <div className="text-[9px] text-[#757575]">Min: {reservationsMin}</div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[10px] text-[#757575] font-medium">Bank Applications</span>
            <div className="text-right">
              <div className="text-sm font-semibold text-[#171717]">{bankApplications}</div>
              <div className="text-[9px] text-[#757575]">Min: {bankApplicationsMin}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
