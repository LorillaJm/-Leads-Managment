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
      className={`${color} rounded-xl p-2.5 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105`}
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.04 + 0.15, type: 'spring', stiffness: 150 }}
          className="text-2xl font-bold text-white mb-0.5"
        >
          {value}
        </motion.div>
        <div className="text-[10px] font-bold text-white uppercase tracking-wider opacity-95">
          {label}
        </div>
        {goal && (
          <div className="text-[9px] text-white/75 mt-0.5 font-medium">
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
      className="bg-white rounded-lg border border-gray-300 shadow-sm overflow-hidden h-full"
    >
      <div className="bg-gray-100 px-2.5 py-1.5 border-b border-gray-300">
        <h3 className="text-xs font-bold text-gray-900">Overview</h3>
        <div className="text-[10px] text-gray-600 mt-0.5">{label}</div>
      </div>
      
      <div className="p-2 space-y-1.5">
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
