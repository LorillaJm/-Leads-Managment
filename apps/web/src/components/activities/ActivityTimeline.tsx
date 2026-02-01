import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { 
  Car, 
  FileText, 
  Building2, 
  CheckCircle2,
  Clock,
  Calendar
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Activity, ActivityType } from '@lead-management/shared'

const activityIcons: Record<ActivityType, any> = {
  TEST_DRIVE: Car,
  RESERVATION: FileText,
  BANK_APPLICATION: Building2,
  CLOSED_DEAL: CheckCircle2,
}

const activityColors: Record<ActivityType, string> = {
  TEST_DRIVE: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  RESERVATION: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  BANK_APPLICATION: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  CLOSED_DEAL: 'bg-green-500/10 text-green-600 border-green-500/20',
}

const activityLabels: Record<ActivityType, string> = {
  TEST_DRIVE: 'Test Drive',
  RESERVATION: 'Reservation',
  BANK_APPLICATION: 'Bank Application',
  CLOSED_DEAL: 'Closed Deal',
}

interface ActivityTimelineProps {
  activities: Activity[]
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (!activities || activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
          <Clock className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No Activities Yet</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Start tracking this lead's journey by adding their first activity.
        </p>
      </div>
    )
  }

  // Sort activities by date (most recent first)
  const sortedActivities = [...activities].sort((a, b) => {
    const dateA = new Date(a.completedDate || a.scheduledDate || a.createdAt)
    const dateB = new Date(b.completedDate || b.scheduledDate || b.createdAt)
    return dateB.getTime() - dateA.getTime()
  })

  return (
    <div className="relative space-y-6">
      {/* Timeline line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

      {sortedActivities.map((activity, index) => {
        const Icon = activityIcons[activity.type as ActivityType]
        const colorClass = activityColors[activity.type as ActivityType]
        const label = activityLabels[activity.type as ActivityType]
        const activityDate = activity.completedDate || activity.scheduledDate || activity.createdAt
        const isCompleted = !!activity.completedDate

        return (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative pl-16"
          >
            {/* Icon */}
            <div className={`absolute left-0 h-12 w-12 rounded-xl border-2 flex items-center justify-center ${colorClass}`}>
              <Icon className="h-5 w-5" />
            </div>

            {/* Content Card */}
            <div className="glass-card p-4 rounded-xl">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-base">{label}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(activityDate), 'PPP')}
                    </span>
                  </div>
                </div>
                <Badge variant={isCompleted ? 'success' : 'default'} className="text-xs">
                  {isCompleted ? 'Completed' : 'Scheduled'}
                </Badge>
              </div>

              {/* Activity Details */}
              <div className="space-y-2 mt-3">
                {activity.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground">{activity.notes}</p>
                  </div>
                )}

                {activity.type === 'BANK_APPLICATION' && activity.bankName && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Bank:</span>
                    <span className="text-muted-foreground">{activity.bankName}</span>
                  </div>
                )}

                {activity.type === 'CLOSED_DEAL' && (
                  <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-border/50">
                    {activity.chassisNumber && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Chassis Number</p>
                        <p className="text-sm font-medium font-mono">{activity.chassisNumber}</p>
                      </div>
                    )}
                    {activity.vsiNumber && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">VSI Number</p>
                        <p className="text-sm font-medium font-mono">{activity.vsiNumber}</p>
                      </div>
                    )}
                    {activity.dateReleased && (
                      <div className="col-span-2">
                        <p className="text-xs text-muted-foreground mb-1">Date Released</p>
                        <p className="text-sm font-medium">
                          {format(new Date(activity.dateReleased), 'PPP')}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Timestamp */}
              <div className="mt-3 pt-3 border-t border-border/50">
                <p className="text-xs text-muted-foreground">
                  Added {format(new Date(activity.createdAt), 'PPP p')}
                </p>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
