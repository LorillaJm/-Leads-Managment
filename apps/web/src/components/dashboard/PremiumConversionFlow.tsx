import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { ArrowRight, TrendingUp } from 'lucide-react'

interface PremiumConversionFlowProps {
  leadsToProspects: number
  prospectsToClosedDeals: number
  testDrives: number
  reservations: number
  bankApplications: number
  leadsToProspectsGoal?: number
  prospectsToClosedDealsGoal?: number
  testDrivesMin?: number
  reservationsMin?: number
  bankApplicationsMin?: number
}

export function PremiumConversionFlow({
  leadsToProspects,
  prospectsToClosedDeals,
  testDrives,
  reservations,
  bankApplications,
  leadsToProspectsGoal = 20,
  prospectsToClosedDealsGoal = 25,
  testDrivesMin = 300,
  reservationsMin = 120,
  bankApplicationsMin = 180,
}: PremiumConversionFlowProps) {
  const chartData = [
    { stage: 'Leads', value: 100, label: 'Leads' },
    { stage: 'Prospects', value: leadsToProspects, label: 'Prospects' },
    { stage: 'Closed', value: (prospectsToClosedDeals / 100) * leadsToProspects, label: 'Closed Deals' },
  ]

  return (
    <div className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Conversion Flow</h3>
        <p className="text-sm text-slate-500">Sales funnel performance</p>
      </div>

      {/* Chart */}
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
            <XAxis 
              dataKey="label" 
              tick={{ fontSize: 12, fill: '#64748B' }}
              stroke="#CBD5E1"
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#64748B' }}
              stroke="#CBD5E1"
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                fontSize: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                backdropFilter: 'blur(8px)',
                padding: '12px'
              }}
              formatter={(value: any) => [`${value.toFixed(1)}%`, 'Conversion']}
              labelStyle={{ color: '#0F172A', fontWeight: 600 }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#3B82F6" 
              strokeWidth={3}
              fill="url(#colorValue)"
              dot={{ fill: '#3B82F6', r: 5, strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 7 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Conversion Rates */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-blue-700">Leads → Prospects</span>
            <ArrowRight className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-900">{leadsToProspects}%</span>
            <span className="text-xs text-blue-600">Goal: {leadsToProspectsGoal}%</span>
          </div>
          {leadsToProspects >= leadsToProspectsGoal && (
            <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600">
              <TrendingUp className="w-3 h-3" />
              <span className="font-semibold">Goal achieved</span>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl p-4 border border-emerald-200/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-emerald-700">Prospects → Closed</span>
            <ArrowRight className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-900">{prospectsToClosedDeals}%</span>
            <span className="text-xs text-emerald-600">Goal: {prospectsToClosedDealsGoal}%</span>
          </div>
          {prospectsToClosedDeals >= prospectsToClosedDealsGoal && (
            <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600">
              <TrendingUp className="w-3 h-3" />
              <span className="font-semibold">Goal achieved</span>
            </div>
          )}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-slate-700 mb-3">Performance Metrics</div>
        
        <div className="flex items-center justify-between py-2.5 border-b border-slate-100">
          <span className="text-sm font-medium text-slate-700">Test Drives</span>
          <div className="text-right">
            <div className={`text-sm font-semibold ${testDrives >= testDrivesMin ? 'text-emerald-600' : 'text-amber-600'}`}>
              {testDrives.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500">Min: {testDrivesMin}</div>
          </div>
        </div>

        <div className="flex items-center justify-between py-2.5 border-b border-slate-100">
          <span className="text-sm font-medium text-slate-700">Reservations</span>
          <div className="text-right">
            <div className={`text-sm font-semibold ${reservations >= reservationsMin ? 'text-emerald-600' : 'text-amber-600'}`}>
              {reservations.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500">Min: {reservationsMin}</div>
          </div>
        </div>

        <div className="flex items-center justify-between py-2.5">
          <span className="text-sm font-medium text-slate-700">Bank Applications</span>
          <div className="text-right">
            <div className={`text-sm font-semibold ${bankApplications >= bankApplicationsMin ? 'text-emerald-600' : 'text-amber-600'}`}>
              {bankApplications.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500">Min: {bankApplicationsMin}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
