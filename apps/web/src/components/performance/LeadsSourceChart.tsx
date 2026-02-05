import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts'

interface LeadsSourceChartProps {
  data: Array<{
    source: string
    count: number
  }>
}

export function LeadsSourceChart({ data }: LeadsSourceChartProps) {
  const colors = ['#06b6d4', '#14b8a6', '#10b981', '#22c55e']

  return (
    <div className="w-full h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
          barSize={36}
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
            dataKey="source" 
            stroke="hsl(var(--muted-foreground))" 
            fontSize={11}
            width={120}
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
