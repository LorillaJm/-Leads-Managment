import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton'
import { EnterpriseHeader } from '@/components/dashboard/EnterpriseHeader'
import { EnterpriseScopePanel } from '@/components/dashboard/EnterpriseScopePanel'
import { EnterpriseKPIGrid } from '@/components/dashboard/EnterpriseKPIGrid'
import { EnterpriseConversionPanel } from '@/components/dashboard/EnterpriseConversionPanel'
import { EnterpriseSalesTable } from '@/components/dashboard/EnterpriseSalesTable'
import { EnterpriseMetricsPanel } from '@/components/dashboard/EnterpriseMetricsPanel'
import { EnterprisePerformanceChart } from '@/components/dashboard/EnterprisePerformanceChart'

const MONTHS = ['ALL', 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
const YEARS = ['2024', '2025', '2026']

export function DashboardEnterprise() {
  const [selectedYear, setSelectedYear] = useState('2026')
  const [selectedMonths, setSelectedMonths] = useState<string[]>(['ALL'])
  const [selectedConsultant, setSelectedConsultant] = useState('ALL')

  const { data: consultantsData } = useQuery({
    queryKey: ['sales-consultants'],
    queryFn: () => api.getSalesConsultants(),
  })

  const { data: statsData, isLoading } = useQuery({
    queryKey: ['dashboard-stats', selectedYear, selectedMonths, selectedConsultant],
    queryFn: () => api.getDashboardStats({}),
  })

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

  const totals = {
    leads: stats.totalLeads || 0,
    prospects: stats.totalProspects || 0,
    testDrives: stats.totalTestDrives || 0,
    reservations: stats.totalReservations || 0,
    bankApplications: stats.totalBankApplications || 0,
    closedDeals: stats.totalClosedDeals || 0,
  }

  const leadsToProspects = totals.leads > 0 
    ? Math.round((totals.prospects / totals.leads) * 100) 
    : 0
  const prospectsToClosedDeals = totals.prospects > 0
    ? Math.round((totals.closedDeals / totals.prospects) * 100)
    : 0
  const overallConversion = totals.leads > 0
    ? Math.round((totals.closedDeals / totals.leads) * 100 * 10) / 10
    : 0

  if (isLoading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      <EnterpriseHeader />

      <div className="max-w-[1440px] mx-auto px-6 py-6">
        {/* PRIMARY ROW - 12 Column Grid */}
        <div className="grid grid-cols-12 gap-6 mb-6">
          
          {/* Scope Panel - 2 columns */}
          <div className="col-span-2">
            <EnterpriseScopePanel
              selectedYear={selectedYear}
              selectedMonths={selectedMonths}
              selectedConsultant={selectedConsultant}
              years={YEARS}
              months={MONTHS}
              consultants={consultants}
              onYearChange={setSelectedYear}
              onMonthToggle={handleMonthToggle}
              onConsultantChange={setSelectedConsultant}
            />
          </div>

          {/* KPI Grid - 3 columns */}
          <div className="col-span-3">
            <EnterpriseKPIGrid
              leads={totals.leads}
              prospects={totals.prospects}
              testDrives={totals.testDrives}
              reservations={totals.reservations}
              bankApplications={totals.bankApplications}
              closedDeals={totals.closedDeals}
              leadsGoal={1500}
            />
          </div>

          {/* Conversion Flow - 4 columns */}
          <div className="col-span-4">
            <EnterpriseConversionPanel
              leadsToProspects={leadsToProspects}
              prospectsToClosedDeals={prospectsToClosedDeals}
              leadsToProspectsGoal={20}
              prospectsToClosedDealsGoal={25}
            />
          </div>

          {/* Sales Team Table - 3 columns */}
          <div className="col-span-3">
            <EnterpriseSalesTable data={salesTeamData} />
          </div>

        </div>

        {/* SECONDARY ROW - 12 Column Grid */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* Conversion Metrics - 6 columns */}
          <div className="col-span-6">
            <EnterpriseMetricsPanel
              testDrives={totals.testDrives}
              reservations={totals.reservations}
              bankApplications={totals.bankApplications}
              leadsToProspects={leadsToProspects}
              prospectsToClosedDeals={prospectsToClosedDeals}
              overallConversion={overallConversion}
              testDrivesMin={300}
              reservationsMin={120}
              bankApplicationsMin={180}
            />
          </div>

          {/* Sales Performance Chart - 6 columns */}
          <div className="col-span-6">
            <EnterprisePerformanceChart data={salesTeamData} />
          </div>

        </div>
      </div>
    </div>
  )
}
