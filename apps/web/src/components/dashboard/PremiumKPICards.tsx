import { TrendingUp, Users, Car, FileText, Building2, CheckCircle2 } from 'lucide-react'

interface PremiumKPICardsProps {
  leads: number
  prospects: number
  testDrives: number
  reservations: number
  bankApplications: number
  closedDeals: number
  leadsGoal?: number
}

interface KPICardProps {
  icon: any
  label: string
  value: number
  goal?: number
  trend?: number
  color: string
}

function KPICard({ icon: Icon, label, value, goal, trend, color }: KPICardProps) {
  const progress = goal ? Math.min((value / goal) * 100, 100) : null

  return (
    <div className="group relative bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-xl p-4 hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-300/60 transition-all duration-300">
      {/* Icon */}
      <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-4 h-4 text-white" />
      </div>

      {/* Value */}
      <div className="mb-1">
        <div className="text-2xl font-bold text-slate-900 tracking-tight">
          {value.toLocaleString()}
        </div>
      </div>

      {/* Label */}
      <div className="text-xs font-medium text-slate-600 mb-2">
        {label}
      </div>

      {/* Goal Progress */}
      {goal && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-500">Goal: {goal.toLocaleString()}</span>
            <span className="font-semibold text-slate-700">{progress?.toFixed(0)}%</span>
          </div>
          <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full ${color} transition-all duration-500`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Trend (optional) */}
      {trend !== undefined && (
        <div className="mt-2 flex items-center gap-1 text-[10px]">
          <TrendingUp className={`w-3 h-3 ${trend >= 0 ? 'text-emerald-600' : 'text-red-600'}`} />
          <span className={`font-semibold ${trend >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
          <span className="text-slate-500">vs last period</span>
        </div>
      )}
    </div>
  )
}

export function PremiumKPICards({
  leads,
  prospects,
  testDrives,
  reservations,
  bankApplications,
  closedDeals,
  leadsGoal = 1500,
}: PremiumKPICardsProps) {
  return (
    <div className="grid grid-cols-6 gap-4">
      <KPICard
        icon={Users}
        label="Leads"
        value={leads}
        goal={leadsGoal}
        color="bg-gradient-to-br from-slate-600 to-slate-700"
      />
      <KPICard
        icon={TrendingUp}
        label="Prospects"
        value={prospects}
        color="bg-gradient-to-br from-blue-600 to-blue-700"
      />
      <KPICard
        icon={Car}
        label="Test Drives"
        value={testDrives}
        color="bg-gradient-to-br from-violet-600 to-violet-700"
      />
      <KPICard
        icon={FileText}
        label="Reservations"
        value={reservations}
        color="bg-gradient-to-br from-indigo-600 to-indigo-700"
      />
      <KPICard
        icon={Building2}
        label="Bank Apps"
        value={bankApplications}
        color="bg-gradient-to-br from-amber-600 to-amber-700"
      />
      <KPICard
        icon={CheckCircle2}
        label="Closed Deals"
        value={closedDeals}
        color="bg-gradient-to-br from-emerald-600 to-emerald-700"
      />
    </div>
  )
}

export default PremiumKPICards
