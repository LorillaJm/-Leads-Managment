import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { OverviewPanel } from '@/components/dashboard/OverviewPanel'
import { ConversionFlowPanel } from '@/components/dashboard/ConversionFlowPanel'
import { SalesTeamTable } from '@/components/dashboard/SalesTeamTable'
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const MONTHS = ['ALL', 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
const YEARS = ['2024', '2025', '2026']

export function DashboardNew() {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-[1800px] mx-auto">
        {/* Grid Layout matching original dashboard */}
        <div className="grid grid-cols-12 gap-4">
          {/* Left Column - Scope Filter (2 cols) */}
          <div className="col-span-2">
            <div className="bg-white rounded-lg border border-gray-300 shadow-sm overflow-hidden">
              <div className="bg-gray-100 px-3 py-2 border-b border-gray-300">
                <h3 className="text-sm font-bold text-gray-900">Scope</h3>
              </div>
              
              <div className="p-3 space-y-3">
                {/* Year */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Year</label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-full h-8 text-sm bg-cyan-400 hover:bg-cyan-500 text-white border-0 rounded">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {YEARS.map((year) => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Months */}
                <div className="space-y-0.5">
                  {MONTHS.map((month) => (
                    <label key={month} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-1 py-0.5 rounded">
                      <input
                        type="checkbox"
                        checked={selectedMonths.includes(month)}
                        onChange={() => handleMonthToggle(month)}
                        className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-xs font-medium text-gray-700">{month}</span>
                    </label>
                  ))}
                </div>

                {/* Sales Consultant */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Sales Consultant</label>
                  <Select value={selectedConsultant} onValueChange={setSelectedConsultant}>
                    <SelectTrigger className="w-full h-8 text-sm bg-cyan-400 hover:bg-cyan-500 text-white border-0 rounded">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">ALL</SelectItem>
                      {consultants.map((c: any) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.fullName || `${c.firstName} ${c.lastName}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Left - Overview (2 cols) */}
          <div className="col-span-2">
            <OverviewPanel 
              totalCount={totals.leads} 
              label="By count"
              leads={totals.leads}
              prospects={totals.prospects}
              testDrives={totals.testDrives}
              reservations={totals.reservations}
              bankApplications={totals.bankApplications}
              closedDeals={totals.closedDeals}
              leadsGoal={1500}
            />
          </div>

          {/* Center - Conversion Flow (4 cols) */}
          <div className="col-span-4">
            <ConversionFlowPanel
              leadsToProspects={leadsToProspects}
              prospectsToClosedDeals={prospectsToClosedDeals}
              leadsToProspectsGoal={20}
              prospectsToClosedDealsGoal={25}
              testDrives={totals.testDrives}
              reservations={totals.reservations}
              bankApplications={totals.bankApplications}
              testDrivesMin={300}
              reservationsMin={120}
              bankApplicationsMin={180}
            />
          </div>

          {/* Right - Sales Team Table (4 cols) */}
          <div className="col-span-4">
            <SalesTeamTable data={salesTeamData} totalCount={salesTeamData.length} />
          </div>
        </div>
      </div>
    </div>
  )
}
