import { motion } from 'framer-motion'
import { Users, Target, TrendingUp, DollarSign } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ConsultantRanking {
  metrics: {
    totalLeads: number
    closedDeals: number
    conversionRate: number
    totalRevenue?: number
  }
}

interface LeaderboardSummaryProps {
  data: ConsultantRanking[]
}

export function LeaderboardSummary({ data }: LeaderboardSummaryProps) {
  if (!data || data.length === 0) {
    return null
  }

  const totalLeads = data.reduce((sum, item) => sum + item.metrics.totalLeads, 0)
  const totalClosed = data.reduce((sum, item) => sum + item.metrics.closedDeals, 0)
  const avgConversion =
    data.reduce((sum, item) => sum + item.metrics.conversionRate, 0) / data.length
  const totalRevenue = data.reduce(
    (sum, item) => sum + (item.metrics.totalRevenue || 0),
    0
  )

  const stats = [
    {
      label: 'Total Leads',
      value: totalLeads.toLocaleString(),
      icon: Users,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
    },
    {
      label: 'Total Closed',
      value: totalClosed.toLocaleString(),
      icon: Target,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
    },
    {
      label: 'Avg Conversion',
      value: `${avgConversion.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
    },
    {
      label: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={cn(
                'transition-all duration-300 hover:shadow-lg hover:scale-105',
                stat.bgColor,
                stat.borderColor
              )}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">
                      {stat.label}
                    </p>
                    <p className={cn('text-3xl font-bold mt-2', stat.color)}>
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center',
                      stat.bgColor,
                      stat.borderColor,
                      'border'
                    )}
                  >
                    <Icon className={cn('w-6 h-6', stat.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
