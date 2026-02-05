import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton'
import { PremiumHeader } from '@/components/dashboard/PremiumHeader'
import { PremiumFilterPanel } from '@/components/dashboard/PremiumFilterPanel'
import { PremiumKPICards } from '@/components/dashboard/PremiumKPICards'
import { PremiumConversionFlow } from '@/components/dashboard/PremiumConversionFlow'
import { PremiumSalesTable } from '@/components/dashboard/PremiumSalesTable'

const MONTHS = ['ALL', 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
const YEARS = ['2024', '2025', '2026']

export function DashboardPremium() {
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

  if (isLoading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <PremiumHeader />

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Filter Panel - Slim */}
        <div className="w-64 border-r border-slate-200/60 bg-white/40 backdrop-blur-xl">
          <PremiumFilterPanel
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

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto p-8 space-y-6">
            
            {/* KPI Cards - Horizontal */}
            <PremiumKPICards
              leads={totals.leads}
              prospects={totals.prospects}
              testDrives={totals.testDrives}
              reservations={totals.reservations}
              bankApplications={totals.bankApplications}
              closedDeals={totals.closedDeals}
              leadsGoal={1500}
            />

            {/* Main Content Grid */}
            <div className="grid grid-cols-3 gap-6">
              
              {/* Conversion Flow - Spans 2 columns */}
              <div className="col-span-2">
                <PremiumConversionFlow
                  leadsToProspects={leadsToProspects}
                  prospectsToClosedDeals={prospectsToClosedDeals}
                  testDrives={totals.testDrives}
                  reservations={totals.reservations}
                  bankApplications={totals.bankApplications}
                  leadsToProspectsGoal={20}
                  prospectsToClosedDealsGoal={25}
                  testDrivesMin={300}
                  reservationsMin={120}
                  bankApplicationsMin={180}
                />
              </div>

              {/* Sales Team Table - 1 column */}
              <div className="col-span-1">
                <PremiumSalesTable data={salesTeamData} />
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
