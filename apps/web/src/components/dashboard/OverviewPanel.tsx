import { motion } from 'framer-motion'

interface OverviewPanelProps {
  totalCount: number
  label: string
  leads: number
  prospects: number
  testDrives: number
  reservations: number
  bankApplications: number
  closedDeals: number
  leadsGoal?: number
}

interface KPICardProps {
  label: string
  value: number
  goal?: number
  color: string
  index: number
}

function KPICard({ label, value, goal, color, index }: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className={`${color} rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105`}
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.04 + 0.15, type: 'spring', stiffness: 150 }}
          className="text-3xl font-bold text-white mb-1"
        >
          {value}
        </motion.div>
        <div className="text-xs font-bold text-white uppercase tracking-wider opacity-95">
          {label}
        </div>
        {goal && (
          <div className="text-[10px] text-white/75 mt-1 font-medium">
            Goal: {goal}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export function OverviewPanel({ 
  label,
  leads,
  prospects,
  testDrives,
  reservations,
  bankApplications,
  closedDeals,
  leadsGoal = 1500
}: OverviewPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
    >
      <div className="bg-gradient-to-r from-gray-50 to-white px-4 py-2.5 border-b border-gray-200">
        <h3 className="text-sm font-bold text-gray-900">Overview</h3>
        <div className="text-xs text-gray-600 mt-0.5">{label}</div>
      </div>
      
      <div className="p-3 space-y-2">
        <KPICard
          label="LEADS"
          value={leads}
          goal={leadsGoal}
          color="bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900"
          index={0}
        />
        <KPICard
          label="PROSPECTS"
          value={prospects}
          color="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700"
          index={1}
        />
        <KPICard
          label="TEST DRIVES"
          value={testDrives}
          color="bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600"
          index={2}
        />
        <KPICard
          label="RESERVATIONS"
          value={reservations}
          color="bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500"
          index={3}
        />
        <KPICard
          label="BANK APPLICATIONS"
          value={bankApplications}
          color="bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600"
          index={4}
        />
        <KPICard
          label="CLOSED DEALS"
          value={closedDeals}
          color="bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700"
          index={5}
        />
      </div>
    </motion.div>
  )
}
