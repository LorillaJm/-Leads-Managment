import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton'
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

  // Sample data for demonstration when API returns empty
  const sampleSalesTeam = [
    { id: '1', name: 'April Dream Galero', leads: 145, prospects: 89, testDrives: 42, reservations: 28, bankApplications: 35, closedDeals: 18 },
    { id: '2', name: 'Meryl Rose Marterior', leads: 132, prospects: 76, testDrives: 38, reservations: 25, bankApplications: 31, closedDeals: 15 },
    { id: '3', name: 'Mary Joy Lumapac', leads: 128, prospects: 71, testDrives: 35, reservations: 22, bankApplications: 28, closedDeals: 14 },
    { id: '4', name: 'Ma. Angelica Canindo', leads: 118, prospects: 65, testDrives: 32, reservations: 20, bankApplications: 25, closedDeals: 12 },
    { id: '5', name: 'Ron Edward Santos', leads: 112, prospects: 62, testDrives: 30, reservations: 19, bankApplications: 24, closedDeals: 11 },
    { id: '6', name: 'Reynel Gallaza', leads: 105, prospects: 58, testDrives: 28, reservations: 18, bankApplications: 22, closedDeals: 10 },
    { id: '7', name: 'Karlyn Joy Labiero', leads: 98, prospects: 54, testDrives: 26, reservations: 16, bankApplications: 20, closedDeals: 9 },
    { id: '8', name: 'Joseph Besana', leads: 92, prospects: 51, testDrives: 24, reservations: 15, bankApplications: 19, closedDeals: 8 },
    { id: '9', name: 'Kurt Russell Gimotea', leads: 85, prospects: 47, testDrives: 22, reservations: 14, bankApplications: 17, closedDeals: 7 },
    { id: '10', name: 'Mary Angelie Francisco', leads: 78, prospects: 43, testDrives: 20, reservations: 12, bankApplications: 15, closedDeals: 6 },
  ]

  // Use sample consultants if API returns empty
  const consultantsList = consultants.length > 0 ? consultants : sampleSalesTeam.map(c => ({ id: c.id, fullName: c.name }))

  const salesTeamData = rankings.length > 0 
    ? rankings.map((ranking: any) => ({
        id: ranking.userId || ranking.id,
        name: ranking.fullName || ranking.name || 'Unknown',
        leads: ranking.totalLeads || 0,
        prospects: ranking.totalProspects || 0,
        testDrives: ranking.totalTestDrives || 0,
        reservations: ranking.totalReservations || 0,
        bankApplications: ranking.totalBankApplications || 0,
        closedDeals: ranking.totalClosedDeals || 0,
      }))
    : sampleSalesTeam

  // Calculate totals from sales team data if API doesn't provide them
  const calculateTotals = () => {
    if (stats.totalLeads) {
      return {
        leads: stats.totalLeads || 0,
        prospects: stats.totalProspects || 0,
        testDrives: stats.totalTestDrives || 0,
        reservations: stats.totalReservations || 0,
        bankApplications: stats.totalBankApplications || 0,
        closedDeals: stats.totalClosedDeals || 0,
      }
    }
    
    // Calculate from sales team data
    return salesTeamData.reduce((acc: any, consultant: any) => ({
      leads: acc.leads + consultant.leads,
      prospects: acc.prospects + consultant.prospects,
      testDrives: acc.testDrives + consultant.testDrives,
      reservations: acc.reservations + consultant.reservations,
      bankApplications: acc.bankApplications + consultant.bankApplications,
      closedDeals: acc.closedDeals + consultant.closedDeals,
    }), { leads: 0, prospects: 0, testDrives: 0, reservations: 0, bankApplications: 0, closedDeals: 0 })
  }

  const totals = calculateTotals()

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Modern Dashboard Layout */}
      <div className="flex h-screen">
        
        {/* LEFT SIDEBAR - Slim Filter Panel */}
        <aside className="w-64 bg-white border-r border-slate-200 flex-shrink-0 overflow-y-auto">
          <PremiumFilterPanel
            selectedYear={selectedYear}
            selectedMonths={selectedMonths}
            selectedConsultant={selectedConsultant}
            years={YEARS}
            months={MONTHS}
            consultants={consultantsList}
            onYearChange={setSelectedYear}
            onMonthToggle={handleMonthToggle}
            onConsultantChange={setSelectedConsultant}
          />
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1800px] mx-auto p-6 space-y-6">
            
            {/* TOP - Executive KPI Row */}
            <section>
              <PremiumKPICards
                leads={totals.leads}
                prospects={totals.prospects}
                testDrives={totals.testDrives}
                reservations={totals.reservations}
                bankApplications={totals.bankApplications}
                closedDeals={totals.closedDeals}
                leadsGoal={1500}
              />
            </section>

            {/* CENTER - Conversion Analytics */}
            <section>
              <div className="mb-3">
                <h2 className="text-lg font-semibold text-slate-900">Conversion Analytics</h2>
                <p className="text-sm text-slate-600">Track your sales funnel performance</p>
              </div>
              <PremiumConversionFlow
                leadsToProspects={leadsToProspects}
                prospectsToClosedDeals={prospectsToClosedDeals}
                testDrives={totals.testDrives}
                reservations={totals.reservations}
                bankApplications={totals.bankApplications}
              />
            </section>

            {/* BOTTOM - Sales Team Performance */}
            <section>
              <div className="mb-3">
                <h2 className="text-lg font-semibold text-slate-900">Sales Team Performance</h2>
                <p className="text-sm text-slate-600">{salesTeamData.length} consultants</p>
              </div>
              <PremiumSalesTable data={salesTeamData} />
            </section>

          </div>
        </main>

      </div>
    </div>
  )
}
