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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`${color} rounded-lg p-2.5 shadow-sm hover:shadow-md transition-all duration-300`}
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.05 + 0.1, type: 'spring', stiffness: 200 }}
          className="text-2xl font-bold text-white mb-0.5"
        >
          {value}
        </motion.div>
        <div className="text-[10px] font-bold text-white uppercase tracking-wide opacity-95">
          {label}
        </div>
        {goal && (
          <div className="text-[9px] text-white/80 mt-0.5 font-medium">
            (Goal: {goal})
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
      <div className="bg-gray-100 px-3 py-2 border-b border-gray-300">
        <h3 className="text-sm font-bold text-gray-900">Overview</h3>
        <div className="text-xs text-gray-600 mt-0.5">{label}</div>
      </div>
      
      <div className="p-2 space-y-1.5">
        <KPICard
          label="LEADS"
          value={leads}
          goal={leadsGoal}
          color="bg-gradient-to-br from-gray-600 to-gray-700"
          index={0}
        />
        <KPICard
          label="PROSPECTS"
          value={prospects}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
          index={1}
        />
        <KPICard
          label="TEST DRIVES"
          value={testDrives}
          color="bg-gradient-to-br from-blue-400 to-blue-500"
          index={2}
        />
        <KPICard
          label="RESERVATIONS"
          value={reservations}
          color="bg-gradient-to-br from-blue-300 to-blue-400"
          index={3}
        />
        <KPICard
          label="BANK APPLICATIONS"
          value={bankApplications}
          color="bg-gradient-to-br from-yellow-400 to-yellow-500"
          index={4}
        />
        <KPICard
          label="CLOSED DEALS"
          value={closedDeals}
          color="bg-gradient-to-br from-green-500 to-green-600"
          index={5}
        />
      </div>
    </motion.div>
  )
}
