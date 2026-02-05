import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface ColorsChartProps {
  data: Array<{
    color: string
    count: number
    percentage: number
  }>
}

export function ColorsChart({ data }: ColorsChartProps) {
  const COLORS: Record<string, string> = {
    'White': '#f3f4f6',
    'Gray': '#9ca3af',
    'Black': '#1f2937',
    'Blue': '#3b82f6',
    'Green': '#10b981',
    'Undecided': '#e5e7eb'
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-sm">{payload[0].name}</p>
          <p className="text-xs text-muted-foreground">
            {payload[0].value} ({payload[0].payload.percentage}%)
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full h-full min-h-[280px] flex flex-col">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            labelLine={false}
            label={({ percentage }) => `${percentage}%`}
            outerRadius="70%"
            innerRadius="0%"
            fill="#8884d8"
            dataKey="count"
            nameKey="color"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.color] || '#94a3b8'} stroke="hsl(var(--background))" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={50}
            wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
            iconType="circle"
            iconSize={8}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
