import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts'

interface InterestLevelsChartProps {
  data: Array<{
    level: string
    count: number
  }>
}

export function InterestLevelsChart({ data }: InterestLevelsChartProps) {
  const colors = ['#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe']

  return (
    <div className="w-full h-full min-h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 5, bottom: 5 }}
          barSize={32}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} horizontal={false} />
          <XAxis 
            type="number" 
            stroke="hsl(var(--muted-foreground))" 
            fontSize={11}
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis 
            type="category" 
            dataKey="level" 
            stroke="hsl(var(--muted-foreground))" 
            fontSize={10}
            width={140}
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {data.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
