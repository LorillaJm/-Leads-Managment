import { motion } from 'framer-motion'
import { Trophy, Medal, Award, TrendingUp, TrendingDown } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ConsultantRanking {
  consultant: {
    id: string
    name: string
    email: string
  }
  metrics: {
    totalLeads: number
    prospects?: number
    testDrives?: number
    reservations?: number
    bankApplications?: number
    closedDeals: number
    conversionRate: number
    totalRevenue?: number
  }
  previousMetrics?: {
    closedDeals: number
    conversionRate: number
  }
}

interface LeaderboardTopThreeProps {
  data: ConsultantRanking[]
  currentUserId?: string
}

export function LeaderboardTopThree({ data, currentUserId }: LeaderboardTopThreeProps) {
  if (!data || data.length === 0) {
    return null
  }

  const topThree = data.slice(0, 3)

  const getRankConfig = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          icon: Trophy,
          gradient: 'from-amber-500/20 via-amber-400/10 to-amber-600/20',
          border: 'border-amber-500/40',
          iconColor: 'text-amber-500',
          bgGlow: 'bg-amber-500/5',
          label: 'Gold',
          labelColor: 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30',
          scale: 'lg:scale-105',
        }
      case 2:
        return {
          icon: Medal,
          gradient: 'from-slate-400/20 via-slate-300/10 to-slate-500/20',
          border: 'border-slate-400/40',
          iconColor: 'text-slate-400',
          bgGlow: 'bg-slate-400/5',
          label: 'Silver',
          labelColor: 'bg-slate-400/20 text-slate-700 dark:text-slate-400 border-slate-400/30',
          scale: 'lg:scale-100',
        }
      case 3:
        return {
          icon: Award,
          gradient: 'from-amber-700/20 via-amber-600/10 to-amber-800/20',
          border: 'border-amber-700/40',
          iconColor: 'text-amber-700 dark:text-amber-500',
          bgGlow: 'bg-amber-700/5',
          label: 'Bronze',
          labelColor: 'bg-amber-700/20 text-amber-800 dark:text-amber-500 border-amber-700/30',
          scale: 'lg:scale-95',
        }
      default:
        return {
          icon: Trophy,
          gradient: 'from-muted/20 to-muted/10',
          border: 'border-border/50',
          iconColor: 'text-muted-foreground',
          bgGlow: 'bg-muted/5',
          label: 'Top',
          labelColor: 'bg-muted/20 text-muted-foreground border-border/30',
          scale: 'lg:scale-100',
        }
    }
  }

  const getChangeIndicator = (current: number, previous?: number) => {
    if (!previous) return null
    const change = current - previous
    const percentChange = previous > 0 ? ((change / previous) * 100).toFixed(1) : '0.0'

    if (change > 0) {
      return (
        <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
          <TrendingUp className="w-3 h-3" />
          <span className="text-xs font-medium">+{percentChange}%</span>
        </div>
      )
    } else if (change < 0) {
      return (
        <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
          <TrendingDown className="w-3 h-3" />
          <span className="text-xs font-medium">{percentChange}%</span>
        </div>
      )
    }
    return null
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {topThree.map((item, index) => {
        const rank = index + 1
        const config = getRankConfig(rank)
        const Icon = config.icon
        const isCurrentUser = currentUserId && item.consultant.id === currentUserId

        return (
          <motion.div
            key={item.consultant.id}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: index * 0.15,
              duration: 0.5,
              type: 'spring',
              stiffness: 100,
            }}
            className={cn('relative', config.scale)}
          >
            <Card
              className={cn(
                'relative overflow-hidden transition-all duration-300 hover:shadow-2xl',
                'bg-gradient-to-br',
                config.gradient,
                config.border,
                config.bgGlow,
                isCurrentUser && 'ring-2 ring-primary/30'
              )}
            >
              {/* Rank Badge - Top Right */}
              <div className="absolute top-4 right-4">
                <Badge className={cn('font-bold text-sm px-3 py-1', config.labelColor)}>
                  {config.label}
                </Badge>
              </div>

              {/* Medal Icon - Top Center */}
              <div className="flex justify-center pt-6 pb-4">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: index * 0.15 + 0.3, type: 'spring', stiffness: 200 }}
                  className={cn(
                    'w-20 h-20 rounded-full flex items-center justify-center',
                    'bg-gradient-to-br',
                    config.gradient,
                    config.border,
                    'border-2 shadow-lg'
                  )}
                >
                  <Icon className={cn('w-10 h-10', config.iconColor)} />
                </motion.div>
              </div>

              {/* Consultant Info */}
              <div className="text-center px-6 pb-6 space-y-3">
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    {item.consultant.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.consultant.email}
                  </p>
                  {isCurrentUser && (
                    <Badge variant="default" className="mt-2 text-xs">
                      You
                    </Badge>
                  )}
                </div>

                {/* Key Metrics */}
                <div className="space-y-3 pt-4 border-t border-border/30">
                  {/* Closed Deals */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Closed Deals</span>
                    <div className="flex items-center gap-2">
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.15 + 0.5 }}
                        className="text-2xl font-bold text-emerald-600 dark:text-emerald-400"
                      >
                        {item.metrics.closedDeals}
                      </motion.span>
                      {getChangeIndicator(
                        item.metrics.closedDeals,
                        item.previousMetrics?.closedDeals
                      )}
                    </div>
                  </div>

                  {/* Total Leads */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Leads</span>
                    <span className="text-lg font-semibold text-foreground">
                      {item.metrics.totalLeads}
                    </span>
                  </div>

                  {/* Conversion Rate */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Conversion</span>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 font-bold text-base px-3 py-1"
                      >
                        {item.metrics.conversionRate}%
                      </Badge>
                      {getChangeIndicator(
                        item.metrics.conversionRate,
                        item.previousMetrics?.conversionRate
                      )}
                    </div>
                  </div>

                  {/* Revenue if available */}
                  {item.metrics.totalRevenue !== undefined && (
                    <div className="flex items-center justify-between pt-2 border-t border-border/20">
                      <span className="text-sm text-muted-foreground">Revenue</span>
                      <span className="text-lg font-semibold text-foreground">
                        ${item.metrics.totalRevenue.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Performance Badge */}
                <div className="pt-3">
                  <Badge
                    variant="success"
                    className="w-full justify-center py-2 text-sm font-semibold"
                  >
                    Top Performer
                  </Badge>
                </div>
              </div>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
