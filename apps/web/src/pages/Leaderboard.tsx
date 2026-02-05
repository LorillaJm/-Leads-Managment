import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LeaderboardTopThree } from '@/components/performance/LeaderboardTopThree'
import { LeaderboardFullTable } from '@/components/performance/LeaderboardFullTable'
import { LeaderboardFilters } from '@/components/performance/LeaderboardFilters'
import { LeaderboardSummary } from '@/components/performance/LeaderboardSummary'
import { api } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

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
    totalLeads: number
    prospects?: number
    testDrives?: number
    reservations?: number
    bankApplications?: number
    closedDeals: number
    conversionRate: number
    totalRevenue?: number
  }
}

export function Leaderboard() {
  const { user } = useAuth()
  const [rankings, setRankings] = useState<ConsultantRanking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedMetric, setSelectedMetric] = useState('closedDeals')
  const [compareMode, setCompareMode] = useState(false)

  const fetchRankings = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await api.getSalesConsultantRankings(compareMode)
      
      if (response && Array.isArray(response)) {
        // Sort by selected metric
        const sorted = [...response].sort((a, b) => {
          switch (selectedMetric) {
            case 'totalLeads':
              return b.metrics.totalLeads - a.metrics.totalLeads
            case 'conversionRate':
              return b.metrics.conversionRate - a.metrics.conversionRate
            case 'revenue':
              return (b.metrics.totalRevenue || 0) - (a.metrics.totalRevenue || 0)
            case 'closedDeals':
            default:
              return b.metrics.closedDeals - a.metrics.closedDeals
          }
        })
        setRankings(sorted)
      } else {
        setRankings([])
      }
    } catch (err) {
      console.error('Failed to fetch rankings:', err)
      setError('Failed to load rankings. Please try again.')
      setRankings([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRankings()
  }, [compareMode, selectedMetric])

  const handleRefresh = () => {
    fetchRankings()
  }

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period)
    // In a real implementation, this would trigger an API call with the period parameter
    fetchRankings()
  }

  const handleMetricChange = (metric: string) => {
    setSelectedMetric(metric)
  }

  const handleCompareModeToggle = () => {
    setCompareMode(!compareMode)
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Sales Consultant Ranking
            </h1>
            <p className="text-muted-foreground">
              Performance leaderboard and team metrics
            </p>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <LeaderboardFilters
          selectedPeriod={selectedPeriod}
          onPeriodChange={handlePeriodChange}
          selectedMetric={selectedMetric}
          onMetricChange={handleMetricChange}
          compareMode={compareMode}
          onCompareModeToggle={handleCompareModeToggle}
          onRefresh={handleRefresh}
          isLoading={isLoading}
        />
      </motion.div>

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="bg-red-500/10 border-red-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6 space-y-4">
                  <div className="w-20 h-20 bg-muted rounded-full mx-auto" />
                  <div className="h-6 bg-muted rounded w-3/4 mx-auto" />
                  <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      {!isLoading && !error && rankings.length > 0 && (
        <>
          {/* Summary Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <LeaderboardSummary data={rankings} />
          </motion.div>

          {/* Top 3 Performers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-amber-500/5 via-background to-background border-amber-500/20">
              <CardHeader className="border-b border-border/50">
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  Top 3 Performers
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <LeaderboardTopThree data={rankings} currentUserId={user?.id} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Full Ranking Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader className="border-b border-border/50">
                <CardTitle>Complete Rankings</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Full team performance breakdown
                </p>
              </CardHeader>
              <CardContent className="pt-6">
                <LeaderboardFullTable
                  data={rankings}
                  compareMode={compareMode}
                  currentUserId={user?.id}
                />
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}

      {/* Empty State */}
      {!isLoading && !error && rankings.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="bg-muted/30">
            <CardContent className="p-12">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto">
                  <Trophy className="w-10 h-10 text-muted-foreground/50" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No Rankings Available
                  </h3>
                  <p className="text-muted-foreground">
                    Sales consultant rankings will appear here once data is available.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
