import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface MonthlyPerformanceChartProps {
  data: Array<{
    month: string
    leads: number
    prospects: number
    testDrives: number
    reservations: number
    bankApplications: number
    closedDeals: number
  }>
}

export function MonthlyPerformanceChart({ data }: MonthlyPerformanceChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-lg p-4 shadow-lg max-w-xs">
          <p className="font-semibold mb-2">{label}</p>
          <div className="space-y-1 text-xs">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: entry.color }} />
                  <span>{entry.name}:</span>
                </div>
                <span className="font-medium">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey="month" 
            stroke="hsl(var(--muted-foreground))" 
            fontSize={12}
          />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
            iconType="rect"
          />
          <Bar dataKey="leads" stackId="a" fill="#3b82f6" name="Leads" radius={[0, 0, 0, 0]} />
          <Bar dataKey="prospects" stackId="a" fill="#8b5cf6" name="Prospects" radius={[0, 0, 0, 0]} />
          <Bar dataKey="testDrives" stackId="a" fill="#06b6d4" name="Test Drives" radius={[0, 0, 0, 0]} />
          <Bar dataKey="reservations" stackId="a" fill="#10b981" name="Reservations" radius={[0, 0, 0, 0]} />
          <Bar dataKey="bankApplications" stackId="a" fill="#f59e0b" name="Bank Applications" radius={[4, 4, 0, 0]} />
          <Line 
            type="monotone" 
            dataKey="closedDeals" 
            stroke="#ec4899" 
            strokeWidth={3}
            dot={{ fill: '#ec4899', strokeWidth: 2, r: 5 }}
            name="Closed Deals"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
