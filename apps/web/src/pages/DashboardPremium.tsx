import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton'
import { PremiumKPICards } from '@/components/dashboard/PremiumKPICards'
import { PremiumConversionFlow } from '@/components/dashboard/PremiumConversionFlow'
import { PremiumSalesTable } from '@/components/dashboard/PremiumSalesTable'

export function DashboardPremium() {
  const [selectedMonths, setSelectedMonths] = useState<string[]>(['ALL'])

  const { data: statsData, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.getDashboardStats({}),
  })

  const { data: rankingsData } = useQuery({
    queryKey: ['sales-rankings'],
    queryFn: () => api.getSalesConsultantRankings(false),
  })

  const stats = (statsData as any)?.data || {}
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* KPI Cards - Horizontal - SMALLER HEIGHT */}
        <div>
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Overview</h2>
          <PremiumKPICards
            leads={totals.leads}
            prospects={totals.prospects}
            testDrives={totals.testDrives}
            reservations={totals.reservations}
            bankApplications={totals.bankApplications}
            closedDeals={totals.closedDeals}
            leadsGoal={1500}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-3 gap-6">
          
          {/* Conversion Flow - Spans 2 columns */}
          <div className="col-span-2">
            <h2 className="text-sm font-semibold text-slate-700 mb-3">Conversion Flow</h2>
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
            <h2 className="text-sm font-semibold text-slate-700 mb-3">Sales Team</h2>
            <PremiumSalesTable data={salesTeamData} />
          </div>

        </div>
      </div>
    </div>
  )
}
