import { useState } from 'react'
import { motion } from 'framer-motion'
import { Target, TrendingUp, Users, Award, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { StatCard } from '@/components/ui/stat-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { api } from '@/lib/api'
import { PerformanceChart } from '@/components/performance/PerformanceChart'
import { RankingTable } from '@/components/performance/RankingTable'
import { useAuth } from '@/contexts/AuthContext'

export function Performance() {
  const { user } = useAuth()
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month')
  const [compareMonths, setCompareMonths] = useState(false)

  const { data: performanceData } = useQuery({
    queryKey: ['performance-metrics', period],
    queryFn: () => api.getPerformanceStats(period),
  })

  const { data: trendsData } = useQuery({
    queryKey: ['performance-trends', period],
    queryFn: () => api.getPerformanceTrends(period),
  })

  const { data: rankingsData } = useQuery({
    queryKey: ['sales-rankings', compareMonths],
    queryFn: () => api.getSalesConsultantRankings(compareMonths),
    // Both Admin and SC can see rankings (SC sees peers, Admin sees all)
  })

  const metrics = (performanceData as any)?.data?.metrics || {}
  const trends = (trendsData as any)?.data?.trends || []
  const rankings = (rankingsData as any)?.data?.rankings || []

  const isManagement = user?.role === 'ADMIN'

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
            Performance Overview
          </h1>
          <p className="text-muted-foreground">
            Track your sales performance and key metrics
          </p>
        </div>

        {/* Period Selector */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
            <SelectTrigger className="w-[180px] bg-background/60 backdrop-blur-xl border-border/50">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Leads Created"
          value={metrics.leadsCreated || 0}
          icon={Users}
          delay={0}
          className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20"
        />
        <StatCard
          title="Leads Converted"
          value={metrics.leadsConverted || 0}
          icon={Target}
          delay={0.1}
          className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20"
        />
        <StatCard
          title="Conversion Rate"
          value={`${metrics.conversionRate || 0}%`}
          icon={TrendingUp}
          delay={0.2}
          className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20"
        />
        <StatCard
          title="Activities Logged"
          value={metrics.activitiesLogged || 0}
          icon={Award}
          delay={0.3}
          className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20"
        />
      </div>

      {/* Performance Trends Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-background/60 backdrop-blur-xl border-border/50 shadow-lg">
          <CardHeader className="border-b border-border/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold">Performance Trends</CardTitle>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                {period === 'week' ? 'Daily' : period === 'month' ? 'Weekly' : 'Monthly'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <PerformanceChart data={trends} period={period} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Rankings Section - Both Admin and SC */}
      {rankings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-background/60 backdrop-blur-xl border-border/50 shadow-lg">
            <CardHeader className="border-b border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold">
                    {isManagement ? 'Sales Consultant Rankings' : 'Peer Performance Rankings'}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {isManagement 
                      ? 'Performance comparison across your team'
                      : 'Compare your performance with your peers'}
                  </p>
                </div>
                <Tabs value={compareMonths ? 'compare' : 'current'} onValueChange={(v) => setCompareMonths(v === 'compare')}>
                  <TabsList className="bg-muted/50">
                    <TabsTrigger value="current">All Time</TabsTrigger>
                    <TabsTrigger value="compare">This Month vs Last</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <RankingTable data={rankings} compareMode={compareMonths} currentUserId={user?.id} />
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Quick Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid gap-6 md:grid-cols-3"
      >
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20 backdrop-blur-xl">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Conversion Time</p>
                <p className="text-3xl font-semibold mt-2">14 days</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/10">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-sm">
              <ArrowDownRight className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-600 font-medium">2 days faster</span>
              <span className="text-muted-foreground">than last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20 backdrop-blur-xl">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Response Rate</p>
                <p className="text-3xl font-semibold mt-2">87%</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10">
                <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-sm">
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-600 font-medium">5% increase</span>
              <span className="text-muted-foreground">from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20 backdrop-blur-xl">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Follow-up Rate</p>
                <p className="text-3xl font-semibold mt-2">92%</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-500/10">
                <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-sm">
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-600 font-medium">3% increase</span>
              <span className="text-muted-foreground">from last period</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
