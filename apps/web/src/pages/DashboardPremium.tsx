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
import { Users, TrendingUp, Car, FileText, Building2, CheckCircle2, ArrowRight } from 'lucide-react'

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-[1800px] mx-auto space-y-4">
        
        {/* Top Section: Scope + Overview Cards */}
        <div className="grid grid-cols-12 gap-4">
          
          {/* Scope Panel */}
          <div className="col-span-3">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 shadow-2xl">
              <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-4 bg-cyan-400 rounded-full"></div>
                Scope
              </h2>
              
              <div className="space-y-3">
                {/* Year */}
                <div>
                  <label className="text-xs font-medium text-slate-400 mb-1.5 block">Year</label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-full h-9 bg-cyan-500 hover:bg-cyan-600 text-white border-0 rounded-lg font-semibold shadow-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {YEARS.map((year) => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Months - Compact Grid */}
                <div>
                  <label className="text-xs font-medium text-slate-400 mb-1.5 block">Months</label>
                  <div className="grid grid-cols-3 gap-1">
                    {MONTHS.map((month) => (
                      <button
                        key={month}
                        onClick={() => handleMonthToggle(month)}
                        className={`px-2 py-1 text-[10px] font-semibold rounded-md transition-all ${
                          selectedMonths.includes(month)
                            ? 'bg-cyan-500 text-white shadow-lg'
                            : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sales Consultant */}
                <div>
                  <label className="text-xs font-medium text-slate-400 mb-1.5 block">Sales Consultant</label>
                  <Select value={selectedConsultant} onValueChange={setSelectedConsultant}>
                    <SelectTrigger className="w-full h-9 bg-cyan-500 hover:bg-cyan-600 text-white border-0 rounded-lg font-semibold shadow-lg">
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

          {/* Overview KPI Cards - 3x2 Grid */}
          <div className="col-span-9">
            <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 shadow-2xl">
              <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-4 bg-blue-400 rounded-full"></div>
                Overview
                <span className="text-xs font-normal text-slate-400 ml-2">By count</span>
              </h2>
              
              <div className="grid grid-cols-3 gap-3">
                {/* Leads */}
                <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-4 border border-slate-600/50 shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02]">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-600/50 flex items-center justify-center">
                      <Users className="w-5 h-5 text-slate-300" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{totals.leads}</div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">LEADS</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Goal: 1,500</span>
                    <span className={`font-semibold ${totals.leads >= 1500 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {Math.round((totals.leads / 1500) * 100)}%
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 bg-slate-900/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-slate-400 to-slate-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((totals.leads / 1500) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Prospects */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-4 border border-blue-500/50 shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02]">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/30 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-blue-200" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{totals.prospects}</div>
                      <div className="text-[10px] text-blue-200 uppercase tracking-wider font-semibold">PROSPECTS</div>
                    </div>
                  </div>
                  <div className="text-xs text-blue-200/80">
                    {leadsToProspects}% conversion from leads
                  </div>
                </div>

                {/* Test Drives */}
                <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-4 border border-purple-500/50 shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02]">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/30 flex items-center justify-center">
                      <Car className="w-5 h-5 text-purple-200" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{totals.testDrives}</div>
                      <div className="text-[10px] text-purple-200 uppercase tracking-wider font-semibold">TEST DRIVES</div>
                    </div>
                  </div>
                  <div className="text-xs text-purple-200/80">
                    Min: 300
                  </div>
                </div>

                {/* Reservations */}
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl p-4 border border-indigo-500/50 shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02]">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/30 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-indigo-200" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{totals.reservations}</div>
                      <div className="text-[10px] text-indigo-200 uppercase tracking-wider font-semibold">RESERVATIONS</div>
                    </div>
                  </div>
                  <div className="text-xs text-indigo-200/80">
                    Min: 120
                  </div>
                </div>

                {/* Bank Applications */}
                <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl p-4 border border-orange-500/50 shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02]">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/30 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-orange-200" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{totals.bankApplications}</div>
                      <div className="text-[10px] text-orange-200 uppercase tracking-wider font-semibold">BANK APPS</div>
                    </div>
                  </div>
                  <div className="text-xs text-orange-200/80">
                    Min: 180
                  </div>
                </div>

                {/* Closed Deals */}
                <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-4 border border-emerald-500/50 shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02]">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/30 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{totals.closedDeals}</div>
                      <div className="text-[10px] text-emerald-200 uppercase tracking-wider font-semibold">CLOSED DEALS</div>
                    </div>
                  </div>
                  <div className="text-xs text-emerald-200/80">
                    {prospectsToClosedDeals}% from prospects
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section: Conversion Flow + Sales Team */}
        <div className="grid grid-cols-12 gap-4">
          
          {/* Conversion Flow */}
          <div className="col-span-7">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 shadow-2xl">
              <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-4 bg-purple-400 rounded-full"></div>
                Conversion Flow
                <span className="text-xs font-normal text-slate-400 ml-2">By Leads, Prospects, and Closed Deals</span>
              </h2>
              
              {/* Line Chart */}
              <div className="h-[220px] mb-4 bg-slate-900/30 rounded-xl p-3">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { name: 'Leads', value: 1.0, label: 'Leads' },
                    { name: 'Prospects', value: leadsToProspects / 100, label: 'Prospects' },
                    { name: 'Closed', value: (prospectsToClosedDeals / 100) * (leadsToProspects / 100), label: 'Closed Deals' },
                  ]}>
                    <defs>
                      <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis 
                      dataKey="label" 
                      tick={{ fontSize: 11, fill: '#94a3b8' }}
                      stroke="#475569"
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 11, fill: '#94a3b8' }}
                      stroke="#475569"
                      tickLine={false}
                      domain={[-0.2, 1.2]}
                      tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #475569',
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: '#fff'
                      }}
                      formatter={(value: any) => [`${(value * 100).toFixed(1)}%`, 'Conversion']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      fill="url(#lineGradient)"
                      dot={{ fill: '#3b82f6', r: 6, strokeWidth: 3, stroke: '#1e293b' }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Conversion Metrics */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gradient-to-br from-blue-600/20 to-blue-700/20 border border-blue-500/30 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowRight className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-semibold text-blue-300">LEADS → PROSPECTS</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-white">{leadsToProspects}%</span>
                    <span className="text-xs text-slate-400">Goal: 20%</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-700/20 border border-emerald-500/30 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowRight className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-300">PROSPECTS → CLOSED</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-white">{prospectsToClosedDeals}%</span>
                    <span className="text-xs text-slate-400">Goal: 25%</span>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="bg-slate-900/30 rounded-xl p-3 border border-slate-700/30">
                <div className="text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">Performance Metrics</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Test Drives</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${totals.testDrives >= 300 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {totals.testDrives}
                      </span>
                      <span className="text-xs text-slate-500">Min: 300</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Reservations</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${totals.reservations >= 120 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {totals.reservations}
                      </span>
                      <span className="text-xs text-slate-500">Min: 120</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Bank Applications</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${totals.bankApplications >= 180 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {totals.bankApplications}
                      </span>
                      <span className="text-xs text-slate-500">Min: 180</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sales Team Table */}
          <div className="col-span-5">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 flex items-center justify-between">
                <h2 className="text-sm font-bold text-white">Sales Team</h2>
                <span className="text-xs text-blue-200">Count: {salesTeamData.length}</span>
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-slate-900/50 sticky top-0 z-10">
                    <tr>
                      <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                        Consultant
                      </th>
                      <th className="px-2 py-2 text-center text-[10px] font-bold text-slate-300 uppercase">
                        <Users className="w-3 h-3 mx-auto" />
                      </th>
                      <th className="px-2 py-2 text-center text-[10px] font-bold text-slate-300 uppercase">
                        <TrendingUp className="w-3 h-3 mx-auto" />
                      </th>
                      <th className="px-2 py-2 text-center text-[10px] font-bold text-slate-300 uppercase">
                        <Car className="w-3 h-3 mx-auto" />
                      </th>
                      <th className="px-2 py-2 text-center text-[10px] font-bold text-slate-300 uppercase">
                        <FileText className="w-3 h-3 mx-auto" />
                      </th>
                      <th className="px-2 py-2 text-center text-[10px] font-bold text-slate-300 uppercase">
                        <Building2 className="w-3 h-3 mx-auto" />
                      </th>
                      <th className="px-2 py-2 text-center text-[10px] font-bold text-slate-300 uppercase">
                        <CheckCircle2 className="w-3 h-3 mx-auto" />
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/30">
                    {salesTeamData.map((consultant: any, index: number) => (
                      <tr key={consultant.id} className="hover:bg-slate-700/20 transition-colors group">
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-[9px] font-bold">
                              {consultant.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                              <div className="text-[11px] font-semibold text-white">{consultant.name}</div>
                              <div className="text-[9px] text-slate-500">#{index + 1}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-2 text-center">
                          <span className="inline-flex items-center justify-center min-w-[28px] px-1.5 py-0.5 rounded-md bg-slate-700/50 text-[11px] font-bold text-slate-300 group-hover:bg-slate-600/50">
                            {consultant.leads}
                          </span>
                        </td>
                        <td className="px-2 py-2 text-center">
                          <span className="inline-flex items-center justify-center min-w-[28px] px-1.5 py-0.5 rounded-md bg-blue-600/30 text-[11px] font-bold text-blue-300 group-hover:bg-blue-600/50">
                            {consultant.prospects}
                          </span>
                        </td>
                        <td className="px-2 py-2 text-center">
                          <span className="inline-flex items-center justify-center min-w-[28px] px-1.5 py-0.5 rounded-md bg-purple-600/30 text-[11px] font-bold text-purple-300 group-hover:bg-purple-600/50">
                            {consultant.testDrives}
                          </span>
                        </td>
                        <td className="px-2 py-2 text-center">
                          <span className="inline-flex items-center justify-center min-w-[28px] px-1.5 py-0.5 rounded-md bg-indigo-600/30 text-[11px] font-bold text-indigo-300 group-hover:bg-indigo-600/50">
                            {consultant.reservations}
                          </span>
                        </td>
                        <td className="px-2 py-2 text-center">
                          <span className="inline-flex items-center justify-center min-w-[28px] px-1.5 py-0.5 rounded-md bg-orange-600/30 text-[11px] font-bold text-orange-300 group-hover:bg-orange-600/50">
                            {consultant.bankApplications}
                          </span>
                        </td>
                        <td className="px-2 py-2 text-center">
                          <span className="inline-flex items-center justify-center min-w-[28px] px-1.5 py-0.5 rounded-md bg-emerald-600/30 text-[11px] font-bold text-emerald-300 group-hover:bg-emerald-600/50">
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
  )
}
