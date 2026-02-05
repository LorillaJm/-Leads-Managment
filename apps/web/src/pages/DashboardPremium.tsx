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
import { Users, TrendingUp, Car, FileText, Building2, CheckCircle2, LayoutGrid, Maximize2 } from 'lucide-react'

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
    <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-3 overflow-hidden">
      <div className="h-full max-w-[1800px] mx-auto">
        {/* Main Dashboard Grid - 4 Column Layout with Table Emphasis */}
        <div className="h-full flex gap-3">
          
          {/* LEFT: Scope Filter Panel - Fixed Width */}
          <div className="w-[180px] flex-shrink-0">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/60 shadow-lg h-full overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-3 py-2 border-b border-slate-600">
                <h3 className="text-xs font-bold text-white">Scope</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5">
                {/* Year */}
                <div>
                  <label className="text-[10px] font-semibold text-slate-700 mb-1.5 block">Year</label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-full h-8 text-xs bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white border-0 rounded-lg font-semibold shadow-md">
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
                    <label key={month} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 px-1.5 py-1 rounded-lg transition-colors group">
                      <input
                        type="checkbox"
                        checked={selectedMonths.includes(month)}
                        onChange={() => handleMonthToggle(month)}
                        className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                      />
                      <span className="text-[10px] font-medium text-slate-700 group-hover:text-slate-900">{month}</span>
                    </label>
                  ))}
                </div>

                {/* Sales Consultant */}
                <div>
                  <label className="text-[10px] font-semibold text-slate-700 mb-1.5 block">Sales Consultant</label>
                  <Select value={selectedConsultant} onValueChange={setSelectedConsultant}>
                    <SelectTrigger className="w-full h-8 text-xs bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white border-0 rounded-lg font-semibold shadow-md">
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

          {/* MIDDLE-LEFT: Overview KPI Cards - Fixed Width */}
          <div className="w-[200px] flex-shrink-0">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/60 shadow-lg h-full overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-3 py-2 border-b border-slate-600">
                <h3 className="text-xs font-bold text-white">Overview</h3>
                <p className="text-[10px] text-white/80 mt-0.5">By count</p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
                {/* Leads */}
                <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-[10px] font-bold text-white/90 uppercase tracking-wider">LEADS</div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{totals.leads}</div>
                  <div className="text-[9px] text-white/70">Goal: 1,500</div>
                  <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white/60 transition-all duration-500"
                      style={{ width: `${Math.min((totals.leads / 1500) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Prospects */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-[10px] font-bold text-white/90 uppercase tracking-wider">PROSPECTS</div>
                  </div>
                  <div className="text-2xl font-bold text-white">{totals.prospects}</div>
                </div>

                {/* Test Drives */}
                <div className="bg-gradient-to-br from-violet-600 to-violet-700 rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <Car className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-[10px] font-bold text-white/90 uppercase tracking-wider">TEST DRIVES</div>
                  </div>
                  <div className="text-2xl font-bold text-white">{totals.testDrives}</div>
                </div>

                {/* Reservations */}
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-[10px] font-bold text-white/90 uppercase tracking-wider">RESERVATIONS</div>
                  </div>
                  <div className="text-2xl font-bold text-white">{totals.reservations}</div>
                </div>

                {/* Bank Applications */}
                <div className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-[10px] font-bold text-white/90 uppercase tracking-wider">BANK APPS</div>
                  </div>
                  <div className="text-2xl font-bold text-white">{totals.bankApplications}</div>
                </div>

                {/* Closed Deals */}
                <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-[10px] font-bold text-white/90 uppercase tracking-wider">CLOSED DEALS</div>
                  </div>
                  <div className="text-2xl font-bold text-white">{totals.closedDeals}</div>
                </div>
              </div>
            </div>
          </div>

          {/* CENTER: Conversion Flow - Flexible */}
          <div className="flex-1 min-w-0">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/60 shadow-lg h-full overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-3 py-2 border-b border-slate-600">
                <h3 className="text-xs font-bold text-white">Conversion Flow</h3>
                <p className="text-[10px] text-white/80 mt-0.5">By Leads, Prospects, and Closed Deals</p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {/* Chart */}
                <div className="h-[200px] bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-xl p-3 border border-blue-100/50">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { name: 'Leads', value: 1.0 },
                      { name: 'Prospects', value: leadsToProspects / 100 },
                      { name: 'Closed Deals', value: (prospectsToClosedDeals / 100) * (leadsToProspects / 100) },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 11, fill: '#475569' }}
                        stroke="#94a3b8"
                        tickLine={false}
                      />
                      <YAxis 
                        tick={{ fontSize: 11, fill: '#475569' }}
                        stroke="#94a3b8"
                        tickLine={false}
                        domain={[-0.2, 1.2]}
                        tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          fontSize: '12px',
                          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                          backdropFilter: 'blur(8px)',
                          padding: '12px'
                        }}
                        formatter={(value: any) => [`${(value * 100).toFixed(1)}%`, 'Conversion']}
                        labelStyle={{ color: '#0f172a', fontWeight: 600 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', r: 6, strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Conversion Rate Cards */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/80 rounded-xl p-3 border border-blue-200/60 shadow-sm hover:shadow-md transition-all">
                    <div className="text-[9px] text-blue-700 mb-1 font-semibold uppercase tracking-wide">Leads → Prospects</div>
                    <div className="text-2xl font-bold text-blue-900 mb-1">{leadsToProspects}%</div>
                    <div className="text-[9px] text-blue-600">Goal: 20%</div>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/80 rounded-xl p-3 border border-emerald-200/60 shadow-sm hover:shadow-md transition-all">
                    <div className="text-[9px] text-emerald-700 mb-1 font-semibold uppercase tracking-wide">Prospects → Closed</div>
                    <div className="text-2xl font-bold text-emerald-900 mb-1">{prospectsToClosedDeals}%</div>
                    <div className="text-[9px] text-emerald-600">Goal: 25%</div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100/80 rounded-xl p-3 border border-slate-200/60 shadow-sm">
                  <div className="text-[10px] font-bold text-slate-700 mb-2 uppercase tracking-wide">Performance Metrics</div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-200">
                      <span className="text-[10px] text-slate-600 font-medium">Test Drives</span>
                      <div className="text-right">
                        <div className={`text-sm font-bold ${totals.testDrives >= 300 ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {totals.testDrives}
                        </div>
                        <div className="text-[9px] text-slate-500">Min: 300</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center py-1.5 border-b border-slate-200">
                      <span className="text-[10px] text-slate-600 font-medium">Reservations</span>
                      <div className="text-right">
                        <div className={`text-sm font-bold ${totals.reservations >= 120 ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {totals.reservations}
                        </div>
                        <div className="text-[9px] text-slate-500">Min: 120</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center py-1.5">
                      <span className="text-[10px] text-slate-600 font-medium">Bank Applications</span>
                      <div className="text-right">
                        <div className={`text-sm font-bold ${totals.bankApplications >= 180 ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {totals.bankApplications}
                        </div>
                        <div className="text-[9px] text-slate-500">Min: 180</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Sales Team Table - DOMINANT ELEMENT - Wider */}
          <div className="w-[520px] flex-shrink-0">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200/60 shadow-xl h-full overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2.5 flex items-center justify-between shadow-lg">
                <h3 className="text-sm font-bold tracking-wide">Sales Team</h3>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 bg-blue-700/50 rounded-lg hover:bg-blue-800 transition-all hover:scale-110">
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 bg-blue-700/50 rounded-lg hover:bg-blue-800 transition-all hover:scale-110">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="px-3 py-1.5 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 text-right">
                <span className="text-[10px] text-slate-700 font-semibold">Count: {salesTeamData.length}</span>
              </div>

              <div className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white sticky top-0 z-10 shadow-md">
                      <tr>
                        <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider">
                          Sales Consultant
                        </th>
                        <th className="px-2 py-2 text-center text-[10px] font-bold uppercase tracking-wider">
                          <div className="flex items-center justify-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>Leads</span>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-center text-[10px] font-bold uppercase tracking-wider">
                          <div className="flex items-center justify-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            <span>Prosp</span>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-center text-[10px] font-bold uppercase tracking-wider">
                          <div className="flex items-center justify-center gap-1">
                            <Car className="w-3 h-3" />
                            <span>Test</span>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-center text-[10px] font-bold uppercase tracking-wider">
                          <div className="flex items-center justify-center gap-1">
                            <FileText className="w-3 h-3" />
                            <span>Resrv</span>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-center text-[10px] font-bold uppercase tracking-wider">
                          <div className="flex items-center justify-center gap-1">
                            <Building2 className="w-3 h-3" />
                            <span>Bank</span>
                          </div>
                        </th>
                        <th className="px-2 py-2 text-center text-[10px] font-bold uppercase tracking-wider">
                          <div className="flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Closed</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {salesTeamData.map((consultant: any, index: number) => (
                        <tr key={consultant.id} className="hover:bg-blue-50/50 transition-colors group">
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                                {consultant.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                              </div>
                              <div>
                                <div className="text-[11px] font-semibold text-slate-900">{consultant.name}</div>
                                <div className="text-[9px] text-slate-500">#{index + 1}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-2 py-2 text-center">
                            <span className="inline-flex items-center justify-center min-w-[32px] h-6 px-2 rounded-lg bg-slate-100 text-[11px] font-bold text-slate-700 group-hover:bg-slate-200 transition-colors shadow-sm">
                              {consultant.leads}
                            </span>
                          </td>
                          <td className="px-2 py-2 text-center">
                            <span className="inline-flex items-center justify-center min-w-[32px] h-6 px-2 rounded-lg bg-blue-100 text-[11px] font-bold text-blue-700 group-hover:bg-blue-200 transition-colors shadow-sm">
                              {consultant.prospects}
                            </span>
                          </td>
                          <td className="px-2 py-2 text-center">
                            <span className="inline-flex items-center justify-center min-w-[32px] h-6 px-2 rounded-lg bg-violet-100 text-[11px] font-bold text-violet-700 group-hover:bg-violet-200 transition-colors shadow-sm">
                              {consultant.testDrives}
                            </span>
                          </td>
                          <td className="px-2 py-2 text-center">
                            <span className="inline-flex items-center justify-center min-w-[32px] h-6 px-2 rounded-lg bg-indigo-100 text-[11px] font-bold text-indigo-700 group-hover:bg-indigo-200 transition-colors shadow-sm">
                              {consultant.reservations}
                            </span>
                          </td>
                          <td className="px-2 py-2 text-center">
                            <span className="inline-flex items-center justify-center min-w-[32px] h-6 px-2 rounded-lg bg-amber-100 text-[11px] font-bold text-amber-700 group-hover:bg-amber-200 transition-colors shadow-sm">
                              {consultant.bankApplications}
                            </span>
                          </td>
                          <td className="px-2 py-2 text-center">
                            <span className="inline-flex items-center justify-center min-w-[32px] h-6 px-2 rounded-lg bg-emerald-100 text-[11px] font-bold text-emerald-700 group-hover:bg-emerald-200 transition-colors shadow-sm">
                              {consultant.closedDeals}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
