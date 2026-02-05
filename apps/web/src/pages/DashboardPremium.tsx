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
              {/* Header with View Toggle Buttons */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-bold text-white">Sales Team</h2>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 bg-blue-500/30 hover:bg-blue-500/50 rounded-lg transition-colors">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                      </svg>
                    </button>
                    <button className="p-1.5 bg-blue-500/30 hover:bg-blue-500/50 rounded-lg transition-colors">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-blue-200">Count: {salesTeamData.length}</span>
                </div>
              </div>

              {/* Table */}
              <div className="max-h-[280px] overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-blue-600/80 sticky top-0 z-10">
                    <tr>
                      <th className="px-3 py-2.5 text-left text-[10px] font-bold text-white uppercase tracking-wider">
                        <button className="flex items-center gap-1 hover:text-blue-200 transition-colors">
                          <span>Sales Consultant</span>
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                          </svg>
                        </button>
                      </th>
                      <th className="px-2 py-2.5 text-center text-[10px] font-bold text-white uppercase tracking-wider">
                        <button className="flex items-center gap-1 mx-auto hover:text-blue-200 transition-colors">
                          <Users className="w-3 h-3" />
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                          </svg>
                        </button>
                      </th>
                      <th className="px-2 py-2.5 text-center text-[10px] font-bold text-white uppercase tracking-wider">
                        <button className="flex items-center gap-1 mx-auto hover:text-blue-200 transition-colors">
                          <TrendingUp className="w-3 h-3" />
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                          </svg>
                        </button>
                      </th>
                      <th className="px-2 py-2.5 text-center text-[10px] font-bold text-white uppercase tracking-wider">
                        <button className="flex items-center gap-1 mx-auto hover:text-blue-200 transition-colors">
                          <Car className="w-3 h-3" />
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                          </svg>
                        </button>
                      </th>
                      <th className="px-2 py-2.5 text-center text-[10px] font-bold text-white uppercase tracking-wider">
                        <button className="flex items-center gap-1 mx-auto hover:text-blue-200 transition-colors">
                          <FileText className="w-3 h-3" />
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                          </svg>
                        </button>
                      </th>
                      <th className="px-2 py-2.5 text-center text-[10px] font-bold text-white uppercase tracking-wider">
                        <button className="flex items-center gap-1 mx-auto hover:text-blue-200 transition-colors">
                          <Building2 className="w-3 h-3" />
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                          </svg>
                        </button>
                      </th>
                      <th className="px-2 py-2.5 text-center text-[10px] font-bold text-white uppercase tracking-wider">
                        <button className="flex items-center gap-1 mx-auto hover:text-blue-200 transition-colors">
                          <CheckCircle2 className="w-3 h-3" />
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                          </svg>
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/30">
                    {salesTeamData.map((consultant: any) => (
                      <tr key={consultant.id} className="hover:bg-blue-600/10 transition-colors group">
                        <td className="px-3 py-2.5">
                          <div className="text-[11px] font-medium text-slate-200">{consultant.name}</div>
                        </td>
                        <td className="px-2 py-2.5 text-center">
                          <span className="text-[11px] font-semibold text-slate-300">
                            {consultant.leads}
                          </span>
                        </td>
                        <td className="px-2 py-2.5 text-center">
                          <span className="text-[11px] font-semibold text-slate-300">
                            {consultant.prospects}
                          </span>
                        </td>
                        <td className="px-2 py-2.5 text-center">
                          <span className="text-[11px] font-semibold text-slate-300">
                            {consultant.testDrives}
                          </span>
                        </td>
                        <td className="px-2 py-2.5 text-center">
                          <span className="text-[11px] font-semibold text-slate-300">
                            {consultant.reservations}
                          </span>
                        </td>
                        <td className="px-2 py-2.5 text-center">
                          <span className="text-[11px] font-semibold text-slate-300">
                            {consultant.bankApplications}
                          </span>
                        </td>
                        <td className="px-2 py-2.5 text-center">
                          <span className="text-[11px] font-semibold text-slate-300">
                            {consultant.closedDeals}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Performance Chart Below Table */}
              <div className="border-t border-slate-700/50 p-4 bg-slate-900/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded bg-amber-500"></div>
                      <span className="text-slate-400">Leads</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded bg-blue-500"></div>
                      <span className="text-slate-400">Prospects</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded bg-cyan-500"></div>
                      <span className="text-slate-400">Test Drives</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded bg-orange-500"></div>
                      <span className="text-slate-400">Reservations</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded bg-pink-500"></div>
                      <span className="text-slate-400">Bank Applications</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded bg-emerald-500"></div>
                      <span className="text-slate-400">Closed Deals</span>
                    </div>
                  </div>
                </div>
                
                {/* Horizontal Bar Chart */}
                <div className="space-y-1.5">
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
                      <div key={consultant.id} className="flex items-center gap-2">
                        <div className="w-32 text-[10px] text-slate-400 truncate text-right">
                          {consultant.name}
                        </div>
                        <div className="flex-1 h-5 bg-slate-800/50 rounded-full overflow-hidden flex">
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
