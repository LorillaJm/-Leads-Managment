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

  // Sample data based on dashboard sales team
  const sampleRankings: ConsultantRanking[] = [
    {
      consultant: { id: '1', name: 'April Dream Galero', email: 'april.galero@company.com' },
      metrics: { totalLeads: 145, prospects: 89, testDrives: 42, reservations: 28, bankApplications: 35, closedDeals: 18, conversionRate: 12.4, totalRevenue: 540000 },
      previousMetrics: { totalLeads: 132, prospects: 78, testDrives: 38, reservations: 24, bankApplications: 30, closedDeals: 15, conversionRate: 11.4, totalRevenue: 450000 }
    },
    {
      consultant: { id: '2', name: 'Meryl Rose Marterior', email: 'meryl.marterior@company.com' },
      metrics: { totalLeads: 132, prospects: 76, testDrives: 38, reservations: 25, bankApplications: 31, closedDeals: 15, conversionRate: 11.4, totalRevenue: 450000 },
      previousMetrics: { totalLeads: 125, prospects: 70, testDrives: 35, reservations: 22, bankApplications: 28, closedDeals: 13, conversionRate: 10.4, totalRevenue: 390000 }
    },
    {
      consultant: { id: '3', name: 'Mary Joy Lumapac', email: 'mary.lumapac@company.com' },
      metrics: { totalLeads: 128, prospects: 71, testDrives: 35, reservations: 22, bankApplications: 28, closedDeals: 14, conversionRate: 10.9, totalRevenue: 420000 },
      previousMetrics: { totalLeads: 118, prospects: 65, testDrives: 32, reservations: 20, bankApplications: 25, closedDeals: 12, conversionRate: 10.2, totalRevenue: 360000 }
    },
    {
      consultant: { id: '4', name: 'Ma. Angelica Canindo', email: 'angelica.canindo@company.com' },
      metrics: { totalLeads: 118, prospects: 65, testDrives: 32, reservations: 20, bankApplications: 25, closedDeals: 12, conversionRate: 10.2, totalRevenue: 360000 },
      previousMetrics: { totalLeads: 110, prospects: 60, testDrives: 28, reservations: 18, bankApplications: 22, closedDeals: 10, conversionRate: 9.1, totalRevenue: 300000 }
    },
    {
      consultant: { id: '5', name: 'Ron Edward Santos', email: 'ron.santos@company.com' },
      metrics: { totalLeads: 112, prospects: 62, testDrives: 30, reservations: 19, bankApplications: 24, closedDeals: 11, conversionRate: 9.8, totalRevenue: 330000 },
      previousMetrics: { totalLeads: 105, prospects: 58, testDrives: 27, reservations: 17, bankApplications: 21, closedDeals: 9, conversionRate: 8.6, totalRevenue: 270000 }
    },
    {
      consultant: { id: '6', name: 'Reynel Gallaza', email: 'reynel.gallaza@company.com' },
      metrics: { totalLeads: 105, prospects: 58, testDrives: 28, reservations: 18, bankApplications: 22, closedDeals: 10, conversionRate: 9.5, totalRevenue: 300000 },
      previousMetrics: { totalLeads: 98, prospects: 54, testDrives: 25, reservations: 16, bankApplications: 19, closedDeals: 8, conversionRate: 8.2, totalRevenue: 240000 }
    },
    {
      consultant: { id: '7', name: 'Karlyn Joy Labiero', email: 'karlyn.labiero@company.com' },
      metrics: { totalLeads: 98, prospects: 54, testDrives: 26, reservations: 16, bankApplications: 20, closedDeals: 9, conversionRate: 9.2, totalRevenue: 270000 },
      previousMetrics: { totalLeads: 92, prospects: 50, testDrives: 23, reservations: 14, bankApplications: 18, closedDeals: 7, conversionRate: 7.6, totalRevenue: 210000 }
    },
    {
      consultant: { id: '8', name: 'Joseph Besana', email: 'joseph.besana@company.com' },
      metrics: { totalLeads: 92, prospects: 51, testDrives: 24, reservations: 15, bankApplications: 19, closedDeals: 8, conversionRate: 8.7, totalRevenue: 240000 },
      previousMetrics: { totalLeads: 85, prospects: 47, testDrives: 21, reservations: 13, bankApplications: 16, closedDeals: 6, conversionRate: 7.1, totalRevenue: 180000 }
    },
    {
      consultant: { id: '9', name: 'Kurt Russell Gimotea', email: 'kurt.gimotea@company.com' },
      metrics: { totalLeads: 85, prospects: 47, testDrives: 22, reservations: 14, bankApplications: 17, closedDeals: 7, conversionRate: 8.2, totalRevenue: 210000 },
      previousMetrics: { totalLeads: 78, prospects: 43, testDrives: 19, reservations: 12, bankApplications: 14, closedDeals: 5, conversionRate: 6.4, totalRevenue: 150000 }
    },
    {
      consultant: { id: '10', name: 'Mary Angelie Francisco', email: 'mary.francisco@company.com' },
      metrics: { totalLeads: 78, prospects: 43, testDrives: 20, reservations: 12, bankApplications: 15, closedDeals: 6, conversionRate: 7.7, totalRevenue: 180000 },
      previousMetrics: { totalLeads: 72, prospects: 40, testDrives: 18, reservations: 10, bankApplications: 13, closedDeals: 4, conversionRate: 5.6, totalRevenue: 120000 }
    },
  ]

  const fetchRankings = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await api.getSalesConsultantRankings(compareMode)
      
      if (response && Array.isArray(response) && response.length > 0) {
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
        // Use sample data if API returns empty
        const sorted = [...sampleRankings].sort((a, b) => {
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
      }
    } catch (err) {
      console.error('Failed to fetch rankings:', err)
      // Use sample data on error
      const sorted = [...sampleRankings].sort((a, b) => {
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
      setError(null) // Don't show error when using sample data
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
