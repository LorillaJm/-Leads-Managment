import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { Card } from './card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    trend: 'up' | 'down'
  }
  icon: LucideIcon
  delay?: number
  className?: string
}

export function StatCard({ title, value, change, icon: Icon, delay = 0, className }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <Card className={cn("hover:scale-[1.02] transition-transform duration-300 cursor-pointer", className)}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
            <p className="text-3xl font-semibold tracking-tight mb-2">{value}</p>
            {change && (
              <div className="flex items-center gap-1">
                <span
                  className={cn(
                    'text-sm font-medium',
                    change.trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                  )}
                >
                  {change.trend === 'up' ? '+' : ''}{change.value}%
                </span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            )}
          </div>
          <div className="rounded-xl bg-primary/10 p-3">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
