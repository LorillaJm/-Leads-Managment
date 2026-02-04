import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { KPIPanel } from '@/components/dashboard/KPIPanel'
import { OverviewPanel } from '@/components/dashboard/OverviewPanel'
import { ConversionFlowPanel } from '@/components/dashboard/ConversionFlowPanel'
import { ActivityBreakdownPanel } from '@/components/dashboard/ActivityBreakdownPanel'
import { SalesTeamTable } from '@/components/dashboard/SalesTeamTable'
import { AnalyticsChart } from '@/components/dashboard/AnalyticsChart'
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

  const chartData = salesTeamData.map((item: any) => ({
    consultant: item.name,
    leads: item.leads,
    prospects: item.prospects,
    testDrives: item.testDrives,
    reservations: item.reservations,
    bankApplications: item.bankApplications,
    closedDeals: item.closedDeals,
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
    <div className="space-y-3">
      <div className="flex gap-3 lg:gap-4">
        {/* Left Column - Scope & KPIs */}
        <div className="w-36 lg:w-44 flex-shrink-0 space-y-3">
        {/* Scope Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-2.5">
          <h3 className="text-xs font-bold text-gray-900 mb-2">Scope</h3>
          
          {/* Year */}
          <div className="mb-2">
            <label className="text-[10px] font-semibold text-gray-700 mb-0.5 block">Year</label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-full h-7 text-xs bg-cyan-400 text-white border-cyan-500">
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
          <div className="space-y-0.5 mb-2">
            {MONTHS.map((month) => (
              <label key={month} className="flex items-center gap-1.5 cursor-pointer text-[10px]">
                <input
                  type="checkbox"
                  checked={selectedMonths.includes(month)}
                  onChange={() => handleMonthToggle(month)}
                  className="w-2.5 h-2.5 rounded border-gray-300 text-blue-600"
                />
                <span className="font-medium text-gray-700">{month}</span>
              </label>
            ))}
          </div>

          {/* Sales Consultant */}
          <div>
            <label className="text-[10px] font-semibold text-gray-700 mb-0.5 block">Sales Consultant</label>
            <Select value={selectedConsultant} onValueChange={setSelectedConsultant}>
              <SelectTrigger className="w-full h-7 text-xs bg-cyan-400 text-white border-cyan-500">
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

        {/* KPI Cards */}
        <KPIPanel
          leads={totals.leads}
          prospects={totals.prospects}
          testDrives={totals.testDrives}
          reservations={totals.reservations}
          bankApplications={totals.bankApplications}
          closedDeals={totals.closedDeals}
          collapsed={false}
        />
      </div>

      {/* Middle Column - Overview, Conversion, Activities */}
      <div className="flex-1 space-y-3 lg:space-y-4">
        {/* Top Row - Overview & Conversion Flow */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
          <OverviewPanel totalCount={totals.leads} label="By count" />
          <ConversionFlowPanel
            leadsToProspects={leadsToProspects}
            prospectsToClosedDeals={prospectsToClosedDeals}
          />
        </div>

        {/* Bottom Row - Activity Cards */}
        <ActivityBreakdownPanel
          testDrives={totals.testDrives}
          reservations={totals.reservations}
          bankApplications={totals.bankApplications}
        />
      </div>

      {/* Right Column - Sales Team */}
      <div className="w-64 lg:w-80 flex-shrink-0">
        <SalesTeamTable data={salesTeamData} totalCount={salesTeamData.length} />
      </div>
      </div>

      {/* Bottom Row - Analytics Chart */}
      <AnalyticsChart data={chartData} />
    </div>
  )
}
