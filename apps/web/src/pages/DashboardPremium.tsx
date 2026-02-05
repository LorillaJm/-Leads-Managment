import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

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
    <div className="h-screen bg-white p-3 overflow-hidden">
      <div className="h-full max-w-[1600px] mx-auto">
        {/* Main Dashboard Grid - 3 Column Layout */}
        <div className="h-full flex gap-3">
          
          {/* LEFT: Scope Filter Panel - Fixed Width */}
          <div className="w-[180px] flex-shrink-0">
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm h-full overflow-hidden flex flex-col">
              <div className="bg-slate-50 px-2.5 py-1.5 border-b border-slate-200">
                <h3 className="text-xs font-bold text-slate-900">Scope</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {/* Year */}
                <div>
                  <label className="text-[10px] font-semibold text-slate-700 mb-1 block">Year</label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-full h-7 text-xs bg-cyan-500 hover:bg-cyan-600 text-white border-0 rounded font-medium">
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
                    <label key={month} className="flex items-center gap-1.5 cursor-pointer hover:bg-slate-50 px-1 py-0.5 rounded transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedMonths.includes(month)}
                        onChange={() => handleMonthToggle(month)}
                        className="w-3 h-3 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                      />
                      <span className="text-[10px] font-medium text-slate-700">{month}</span>
                    </label>
                  ))}
                </div>

                {/* Sales Consultant */}
                <div>
                  <label className="text-[10px] font-semibold text-slate-700 mb-1 block">Sales Consultant</label>
                  <Select value={selectedConsultant} onValueChange={setSelectedConsultant}>
                    <SelectTrigger className="w-full h-7 text-xs bg-cyan-500 hover:bg-cyan-600 text-white border-0 rounded font-medium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">ALL</SelectItem>
                      {consultantsList.map((c: any) => (
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

          {/* MIDDLE-LEFT: Overview KPI Cards - Fixed Width */}
          <div className="w-[200px] flex-shrink-0">
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm h-full overflow-hidden flex flex-col">
              <div className="bg-slate-50 px-2.5 py-1.5 border-b border-slate-200">
                <h3 className="text-xs font-bold text-slate-900">Overview</h3>
                <p className="text-[10px] text-slate-600 mt-0.5">By count</p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
                {/* Leads */}
                <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-2.5 shadow-md">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-0.5">{totals.leads}</div>
                    <div className="text-[10px] font-bold text-white uppercase tracking-wider opacity-90">LEADS</div>
                    <div className="text-[9px] text-white/70 mt-0.5">Goal: 1,500</div>
                  </div>
                </div>

                {/* Prospects */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-2.5 shadow-md">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-0.5">{totals.prospects}</div>
                    <div className="text-[10px] font-bold text-white uppercase tracking-wider opacity-90">PROSPECTS</div>
                  </div>
                </div>

                {/* Test Drives */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-2.5 shadow-md">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-0.5">{totals.testDrives}</div>
                    <div className="text-[10px] font-bold text-white uppercase tracking-wider opacity-90">TEST DRIVES</div>
                  </div>
                </div>

                {/* Reservations */}
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl p-2.5 shadow-md">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-0.5">{totals.reservations}</div>
                    <div className="text-[10px] font-bold text-white uppercase tracking-wider opacity-90">RESERVATIONS</div>
                  </div>
                </div>

                {/* Bank Applications */}
                <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl p-2.5 shadow-md">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-0.5">{totals.bankApplications}</div>
                    <div className="text-[10px] font-bold text-white uppercase tracking-wider opacity-90">BANK APPLICATIONS</div>
                  </div>
                </div>

                {/* Closed Deals */}
                <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-2.5 shadow-md">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-0.5">{totals.closedDeals}</div>
                    <div className="text-[10px] font-bold text-white uppercase tracking-wider opacity-90">CLOSED DEALS</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CENTER: Conversion Flow - Flexible */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm h-full overflow-hidden flex flex-col">
              <div className="bg-slate-50 px-2.5 py-1.5 border-b border-slate-200">
                <h3 className="text-xs font-bold text-slate-900">Conversion Flow</h3>
                <p className="text-[10px] text-slate-600 mt-0.5">By Leads, Prospects, and Closed Deals</p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {/* Chart */}
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { name: 'Leads', value: 1.0 },
                      { name: 'Prospects', value: leadsToProspects / 100 },
                      { name: 'Closed Deals', value: (prospectsToClosedDeals / 100) * (leadsToProspects / 100) },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        stroke="#cbd5e1"
                      />
                      <YAxis 
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        stroke="#cbd5e1"
                        domain={[-0.2, 1.2]}
                        tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          fontSize: '12px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                        formatter={(value: any) => `${(value * 100).toFixed(1)}%`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', r: 5, strokeWidth: 2, stroke: '#fff' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Conversion Rate Cards */}
                <div className="grid grid-cols-2 gap-1.5">
                  <div className="bg-slate-50 rounded p-1.5 border border-slate-200">
                    <div className="text-[9px] text-slate-600 mb-0.5 font-medium">Leads → Prospects</div>
                    <div className="text-lg font-bold text-slate-900">{leadsToProspects}%</div>
                    <div className="text-[9px] text-slate-500 mt-0.5">Goal: 20%</div>
                  </div>

                  <div className="bg-slate-50 rounded p-1.5 border border-slate-200">
                    <div className="text-[9px] text-slate-600 mb-0.5 font-medium">Prospects → Closed Deals</div>
                    <div className="text-lg font-bold text-slate-900">{prospectsToClosedDeals}%</div>
                    <div className="text-[9px] text-slate-500 mt-0.5">Goal: 25%</div>
                  </div>
                </div>

                {/* Additional Metrics */}
                <div className="space-y-1 pt-1.5 border-t border-slate-200">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-600 font-medium">Test Drives</span>
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-900">{totals.testDrives}</div>
                      <div className="text-[9px] text-slate-500">Minimum: 300</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-600 font-medium">Reservations</span>
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-900">{totals.reservations}</div>
                      <div className="text-[9px] text-slate-500">Minimum: 120</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-600 font-medium">Bank Applications</span>
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-900">{totals.bankApplications}</div>
                      <div className="text-[9px] text-slate-500">Minimum: 180</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Sales Team Table - Fixed Width */}
          <div className="w-[420px] flex-shrink-0">
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm h-full overflow-hidden flex flex-col">
              {/* Header with View Toggle Buttons */}
              <div className="bg-blue-600 text-white px-2.5 py-1.5">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xs font-bold">Sales Team</h3>
                  <div className="flex items-center gap-1.5">
                    <button className="p-1 bg-blue-700 rounded hover:bg-blue-800 transition-colors">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                      </svg>
                    </button>
                    <button className="p-1 bg-blue-700 rounded hover:bg-blue-800 transition-colors">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-blue-200 font-medium">Count: {salesTeamData.length}</span>
                </div>
              </div>

              {/* Table with Sortable Headers */}
              <div className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-blue-600 text-white sticky top-0 z-10">
                      <tr>
                        <th className="px-2 py-2 text-left text-[9px] font-bold uppercase tracking-wide">
                          <button className="flex items-center gap-1 hover:text-blue-200 transition-colors">
                            <span>Sales Consultant</span>
                            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                          </button>
                        </th>
                        <th className="px-1 py-2 text-center text-[9px] font-bold uppercase">
                          <button className="flex items-center gap-0.5 mx-auto hover:text-blue-200 transition-colors">
                            <span>L</span>
                            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                          </button>
                        </th>
                        <th className="px-1 py-2 text-center text-[9px] font-bold uppercase">
                          <button className="flex items-center gap-0.5 mx-auto hover:text-blue-200 transition-colors">
                            <span>P</span>
                            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                          </button>
                        </th>
                        <th className="px-1 py-2 text-center text-[9px] font-bold uppercase">
                          <button className="flex items-center gap-0.5 mx-auto hover:text-blue-200 transition-colors">
                            <span>T</span>
                            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                          </button>
                        </th>
                        <th className="px-1 py-2 text-center text-[9px] font-bold uppercase">
                          <button className="flex items-center gap-0.5 mx-auto hover:text-blue-200 transition-colors">
                            <span>R</span>
                            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                          </button>
                        </th>
                        <th className="px-1 py-2 text-center text-[9px] font-bold uppercase">
                          <button className="flex items-center gap-0.5 mx-auto hover:text-blue-200 transition-colors">
                            <span>B</span>
                            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                          </button>
                        </th>
                        <th className="px-1 py-2 text-center text-[9px] font-bold uppercase">
                          <button className="flex items-center gap-0.5 mx-auto hover:text-blue-200 transition-colors">
                            <span>C</span>
                            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                          </button>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {salesTeamData.map((consultant: any) => (
                        <tr key={consultant.id} className="hover:bg-blue-50 transition-colors">
                          <td className="px-2 py-1.5 text-[10px] text-slate-900 font-medium">{consultant.name}</td>
                          <td className="px-1 py-1.5 text-[10px] text-center text-slate-700">{consultant.leads}</td>
                          <td className="px-1 py-1.5 text-[10px] text-center text-slate-700">{consultant.prospects}</td>
                          <td className="px-1 py-1.5 text-[10px] text-center text-slate-700">{consultant.testDrives}</td>
                          <td className="px-1 py-1.5 text-[10px] text-center text-slate-700">{consultant.reservations}</td>
                          <td className="px-1 py-1.5 text-[10px] text-center text-slate-700">{consultant.bankApplications}</td>
                          <td className="px-1 py-1.5 text-[10px] text-center text-slate-700">{consultant.closedDeals}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Performance Chart Below Table */}
              <div className="border-t border-slate-200 p-3 bg-slate-50">
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[9px] mb-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2.5 h-2.5 rounded bg-amber-500"></div>
                    <span className="text-slate-600">Leads</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2.5 h-2.5 rounded bg-blue-500"></div>
                    <span className="text-slate-600">Prospects</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2.5 h-2.5 rounded bg-cyan-500"></div>
                    <span className="text-slate-600">Test Drives</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2.5 h-2.5 rounded bg-orange-500"></div>
                    <span className="text-slate-600">Reservations</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2.5 h-2.5 rounded bg-pink-500"></div>
                    <span className="text-slate-600">Bank Apps</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2.5 h-2.5 rounded bg-emerald-500"></div>
                    <span className="text-slate-600">Closed</span>
                  </div>
                </div>
                
                {/* Horizontal Bar Chart */}
                <div className="space-y-1">
                  {salesTeamData.slice(0, 10).map((consultant: any) => {
                    const maxValue = Math.max(
                      consultant.leads,
                      consultant.prospects,
                      consultant.testDrives,
                      consultant.reservations,
                      consultant.bankApplications,
                      consultant.closedDeals
                    )
                    return (
                      <div key={consultant.id} className="flex items-center gap-1.5">
                        <div className="w-28 text-[9px] text-slate-600 truncate text-right">
                          {consultant.name}
                        </div>
                        <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden flex">
                          {consultant.leads > 0 && (
                            <div 
                              className="bg-amber-500 h-full transition-all duration-500"
                              style={{ width: `${(consultant.leads / maxValue) * 100}%` }}
                            />
                          )}
                          {consultant.prospects > 0 && (
                            <div 
                              className="bg-blue-500 h-full transition-all duration-500"
                              style={{ width: `${(consultant.prospects / maxValue) * 100}%` }}
                            />
                          )}
                          {consultant.testDrives > 0 && (
                            <div 
                              className="bg-cyan-500 h-full transition-all duration-500"
                              style={{ width: `${(consultant.testDrives / maxValue) * 100}%` }}
                            />
                          )}
                          {consultant.reservations > 0 && (
                            <div 
                              className="bg-orange-500 h-full transition-all duration-500"
                              style={{ width: `${(consultant.reservations / maxValue) * 100}%` }}
                            />
                          )}
                          {consultant.bankApplications > 0 && (
                            <div 
                              className="bg-pink-500 h-full transition-all duration-500"
                              style={{ width: `${(consultant.bankApplications / maxValue) * 100}%` }}
                            />
                          )}
                          {consultant.closedDeals > 0 && (
                            <div 
                              className="bg-emerald-500 h-full transition-all duration-500"
                              style={{ width: `${(consultant.closedDeals / maxValue) * 100}%` }}
                            />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
