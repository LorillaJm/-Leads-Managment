import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface VehicleModelsChartProps {
  data: Array<{
    model: string
    inquiryCount: number
    closedDeals: number
  }>
}

export function VehicleModelsChart({ data }: VehicleModelsChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-lg p-3 shadow-lg">
          <p className="font-semibold mb-2 text-sm">{label}</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-gray-400" />
              <span className="text-xs">Inquiry Count: {payload[0]?.value || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-emerald-500" />
              <span className="text-xs">Closed Deals: {payload[1]?.value || 0}</span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-[500px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey="model" 
            stroke="hsl(var(--muted-foreground))" 
            fontSize={10}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
            iconType="square"
          />
          <Bar dataKey="inquiryCount" fill="#9ca3af" name="Inquiry Count" radius={[4, 4, 0, 0]} />
          <Bar dataKey="closedDeals" fill="#10b981" name="Closed Deals" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
