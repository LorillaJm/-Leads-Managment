import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Menu, X } from 'lucide-react'
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
    <div className="bg-gray-50 -mx-6 -my-8 px-6 py-8">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 mb-4 rounded-lg">
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700"
        >
          {mobileFiltersOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          {mobileFiltersOpen ? 'Close Filters' : 'Open Filters'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar - Filters (Desktop & Mobile Drawer) */}
        <div className={`
          ${mobileFiltersOpen ? 'block' : 'hidden'} lg:block
          w-full lg:w-48 flex-shrink-0
        `}>
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

        {/* Left KPI Panel */}
        <div className="w-full lg:w-56 flex-shrink-0 lg:border-r border-gray-200">
          <KPIPanel
            leads={totals.leads}
            prospects={totals.prospects}
            testDrives={totals.testDrives}
            reservations={totals.reservations}
            bankApplications={totals.bankApplications}
            closedDeals={totals.closedDeals}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-4 lg:p-6 space-y-4 lg:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Overview */}
            <div>
              <OverviewPanel
                totalCount={totals.leads}
                label="By count"
              />
            </div>

            {/* Conversion Flow */}
            <div className="lg:col-span-2">
              <ConversionFlowPanel
                leadsToProspects={leadsToProspects}
                prospectsToClosedDeals={prospectsToClosedDeals}
              />
            </div>
          </div>

          {/* Activity Breakdown */}
          <ActivityBreakdownPanel
            testDrives={totals.testDrives}
            reservations={totals.reservations}
            bankApplications={totals.bankApplications}
          />

          {/* Sales Team Table - Mobile */}
          <div className="lg:hidden">
            <SalesTeamTable
              data={salesTeamData}
              totalCount={salesTeamData.length}
            />
          </div>

          {/* Analytics Chart */}
          <AnalyticsChart data={chartData} />
        </div>

        {/* Right Panel - Sales Team Table (Desktop Only) */}
        <div className="hidden lg:block w-96 flex-shrink-0 p-6">
          <SalesTeamTable
            data={salesTeamData}
            totalCount={salesTeamData.length}
          />
        </div>
      </div>
    </div>
  )
}
