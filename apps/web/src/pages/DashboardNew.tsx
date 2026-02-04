import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Menu, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { api } from '@/lib/api'
import { FilterPanel } from '@/components/dashboard/FilterPanel'
import { KPIPanel } from '@/components/dashboard/KPIPanel'
import { OverviewPanel } from '@/components/dashboard/OverviewPanel'
import { ConversionFlowPanel } from '@/components/dashboard/ConversionFlowPanel'
import { ActivityBreakdownPanel } from '@/components/dashboard/ActivityBreakdownPanel'
import { SalesTeamTable } from '@/components/dashboard/SalesTeamTable'
import { AnalyticsChart } from '@/components/dashboard/AnalyticsChart'
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton'

export function DashboardNew() {
  const [selectedYear, setSelectedYear] = useState('2026')
  const [selectedMonths, setSelectedMonths] = useState<string[]>(['ALL'])
  const [selectedConsultant, setSelectedConsultant] = useState('ALL')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Fetch sales consultants
  const { data: consultantsData } = useQuery({
    queryKey: ['sales-consultants'],
    queryFn: () => api.getSalesConsultants(),
  })

  // Fetch dashboard stats
  const { data: statsData, isLoading } = useQuery({
    queryKey: ['dashboard-stats', selectedYear, selectedMonths, selectedConsultant],
    queryFn: () => api.getDashboardStats({}),
  })

  // Fetch sales team rankings
  const { data: rankingsData } = useQuery({
    queryKey: ['sales-rankings'],
    queryFn: () => api.getSalesConsultantRankings(false),
  })

  const handleMonthToggle = (month: string) => {
    if (month === 'ALL') {
      setSelectedMonths(['ALL'])
    } else {
      const newMonths = selectedMonths.includes(month)
        ? selectedMonths.filter((m) => m !== month && m !== 'ALL')
        : [...selectedMonths.filter((m) => m !== 'ALL'), month]
      
      setSelectedMonths(newMonths.length === 0 ? ['ALL'] : newMonths)
    }
  }

  const stats = (statsData as any)?.data || {}
  const consultants = Array.isArray((consultantsData as any)?.data) 
    ? (consultantsData as any).data 
    : []
  const rankings = Array.isArray((rankingsData as any)?.data)
    ? (rankingsData as any).data
    : []

  // Transform rankings data for table and chart
  const salesTeamData = rankings.map((ranking: any) => ({
    id: ranking.userId || ranking.id,
    name: ranking.fullName || ranking.name || 'Unknown',
    leads: ranking.totalLeads || 0,
    prospects: ranking.totalProspects || 0,
    testDrives: ranking.totalTestDrives || 0,
    reservations: ranking.totalReservations || 0,
    bankApplications: ranking.totalBankApplications || 0,
    closedDeals: ranking.totalClosedDeals || 0,
  }))

  // Calculate totals
  const totals = {
    leads: stats.totalLeads || 0,
    prospects: stats.totalProspects || 0,
    testDrives: stats.totalTestDrives || 0,
    reservations: stats.totalReservations || 0,
    bankApplications: stats.totalBankApplications || 0,
    closedDeals: stats.totalClosedDeals || 0,
  }

  // Calculate conversion rates
  const leadsToProspects = totals.leads > 0 
    ? Math.round((totals.prospects / totals.leads) * 100) 
    : 0
  const prospectsToClosedDeals = totals.prospects > 0
    ? Math.round((totals.closedDeals / totals.prospects) * 100)
    : 0

  // Transform data for analytics chart
  const chartData = salesTeamData.slice(0, 10).map((consultant: any) => ({
    consultant: consultant.name.split(' ').slice(0, 2).join(' '),
    leads: consultant.leads,
    prospects: consultant.prospects,
    testDrives: consultant.testDrives,
    reservations: consultant.reservations,
    bankApplications: consultant.bankApplications,
    closedDeals: consultant.closedDeals,
  }))

  if (isLoading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-4">
      {/* Sidebar Collapse Toggle - Desktop */}
      <div className="hidden lg:block">
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="fixed left-4 top-20 z-50 p-2 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all"
          title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Filter Toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {mobileFiltersOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          {mobileFiltersOpen ? 'Close Filters' : 'Open Filters'}
        </button>
      </div>

      <div className="flex gap-4">
        {/* Left Sidebar - Filters & KPIs */}
        <div className={`
          ${mobileFiltersOpen ? 'block' : 'hidden'} lg:block
          ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'}
          transition-all duration-300 flex-shrink-0
        `}>
          <div className="space-y-4">
            {/* Filters */}
            <div className={sidebarCollapsed ? 'hidden' : 'block'}>
              <FilterPanel
                selectedYear={selectedYear}
                selectedMonths={selectedMonths}
                selectedConsultant={selectedConsultant}
                onYearChange={setSelectedYear}
                onMonthToggle={handleMonthToggle}
                onConsultantChange={setSelectedConsultant}
                salesConsultants={consultants.map((c: any) => ({
                  id: c.id,
                  name: c.fullName || `${c.firstName} ${c.lastName}`,
                }))}
              />
            </div>

            {/* KPI Panel */}
            <KPIPanel
              leads={totals.leads}
              prospects={totals.prospects}
              testDrives={totals.testDrives}
              reservations={totals.reservations}
              bankApplications={totals.bankApplications}
              closedDeals={totals.closedDeals}
              collapsed={sidebarCollapsed}
            />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            {/* Overview */}
            <div className="xl:col-span-1">
              <OverviewPanel
                totalCount={totals.leads}
                label="By count"
              />
            </div>

            {/* Conversion Flow */}
            <div className="xl:col-span-2">
              <ConversionFlowPanel
                leadsToProspects={leadsToProspects}
                prospectsToClosedDeals={prospectsToClosedDeals}
              />
            </div>
          </div>

          {/* Activity Breakdown & Sales Team */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <ActivityBreakdownPanel
              testDrives={totals.testDrives}
              reservations={totals.reservations}
              bankApplications={totals.bankApplications}
            />

            <SalesTeamTable
              data={salesTeamData}
              totalCount={salesTeamData.length}
            />
          </div>

          {/* Analytics Chart */}
          <AnalyticsChart data={chartData} />
        </div>
      </div>
    </div>
  )
}
