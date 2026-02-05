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
              <div className="w-3 h-3 rounded bg-slate-400" />
              <span className="text-xs">Inquiry: {payload[0]?.value || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-emerald-500" />
              <span className="text-xs">Closed: {payload[1]?.value || 0}</span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full h-full min-h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 80 }}
          barGap={2}
          barCategoryGap="15%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} vertical={false} />
          <XAxis 
            dataKey="model" 
            stroke="hsl(var(--muted-foreground))" 
            fontSize={10}
            angle={-45}
            textAnchor="end"
            height={80}
            interval={0}
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))" 
            fontSize={11}
            width={35}
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted) / 0.1)' }} />
          <Legend 
            wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
            iconType="rect"
            iconSize={10}
          />
          <Bar dataKey="inquiryCount" fill="hsl(var(--muted-foreground) / 0.6)" name="Inquiry Count" radius={[3, 3, 0, 0]} maxBarSize={40} />
          <Bar dataKey="closedDeals" fill="hsl(142 76% 36%)" name="Closed Deals" radius={[3, 3, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
