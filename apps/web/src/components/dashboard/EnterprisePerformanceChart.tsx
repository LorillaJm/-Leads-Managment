import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

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

interface EnterprisePerformanceChartProps {
  data: SalesConsultant[]
}

export function EnterprisePerformanceChart({ data }: EnterprisePerformanceChartProps) {
  // Take top 8 performers by closed deals
  const topPerformers = [...data]
    .sort((a, b) => b.closedDeals - a.closedDeals)
    .slice(0, 8)
    .map(consultant => ({
      name: consultant.name.split(' ')[0], // First name only
      Leads: consultant.leads,
      Prospects: consultant.prospects,
      Closed: consultant.closedDeals,
    }))

  return (
    <div className="bg-white rounded-[10px] border border-[#E5E7EB] shadow-[0_1px_2px_0_rgb(0_0_0_/0.03)] overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="bg-[#F9FAFB] px-4 py-3 border-b border-[#E5E7EB]">
        <h3 className="text-[13px] font-semibold text-[#111827]">Sales Performance</h3>
        <p className="text-[10px] text-[#6B7280] mt-0.5">Top performers by closed deals</p>
      </div>

      {/* Chart */}
      <div className="flex-1 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topPerformers}>
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
              cursor={{ fill: '#F9FAFB' }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '11px' }}
              iconType="circle"
              iconSize={8}
            />
            <Bar dataKey="Leads" fill="#9CA3AF" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Prospects" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Closed" fill="#059669" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
