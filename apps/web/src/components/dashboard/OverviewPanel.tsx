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
      className={`${color} rounded-lg p-2.5 shadow-md hover:shadow-lg transition-all duration-300`}
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
        <div className="text-[10px] font-bold text-white uppercase tracking-wider opacity-95">
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
      className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 p-3 shadow-lg"
      style={{
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }}
    >
      <h3 className="text-sm font-bold text-gray-900 mb-1">Overview</h3>
      <div className="text-[10px] text-gray-500 mb-2">{label}</div>
      
      <div className="space-y-1.5">
        <KPICard
          label="LEADS"
          value={leads}
          goal={leadsGoal}
          color="bg-gradient-to-br from-gray-700 to-gray-800"
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
          color="bg-gradient-to-br from-yellow-500 to-yellow-600"
          index={4}
        />
        <KPICard
          label="CLOSED DEALS"
          value={closedDeals}
          color="bg-gradient-to-br from-green-600 to-green-700"
          index={5}
        />
      </div>
    </motion.div>
  )
}
