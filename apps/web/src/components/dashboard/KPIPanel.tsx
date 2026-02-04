import { motion } from 'framer-motion'

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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className={`${color} rounded-lg p-4 shadow-sm`}
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.05 + 0.2, type: 'spring' }}
          className="text-4xl font-bold text-white mb-1"
        >
          {value}
        </motion.div>
        <div className="text-sm font-bold text-white uppercase tracking-wide">
          {label}
        </div>
        {goal && (
          <div className="text-xs text-white/90 mt-1">
            (Goal: {goal})
          </div>
        )}
      </div>
    </motion.div>
  )
}

interface KPIPanelProps {
  leads: number
  prospects: number
  testDrives: number
  reservations: number
  bankApplications: number
  closedDeals: number
  leadsGoal?: number
}

export function KPIPanel({
  leads,
  prospects,
  testDrives,
  reservations,
  bankApplications,
  closedDeals,
  leadsGoal = 1500,
}: KPIPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-3 p-4"
    >
      <KPICard
        label="LEADS"
        value={leads}
        goal={leadsGoal}
        color="bg-gray-700"
        index={0}
      />
      <KPICard
        label="PROSPECTS"
        value={prospects}
        color="bg-blue-500"
        index={1}
      />
      <KPICard
        label="TEST DRIVES"
        value={testDrives}
        color="bg-blue-400"
        index={2}
      />
      <KPICard
        label="RESERVATIONS"
        value={reservations}
        color="bg-blue-300"
        index={3}
      />
      <KPICard
        label="BANK APPLICATIONS"
        value={bankApplications}
        color="bg-yellow-500"
        index={4}
      />
      <KPICard
        label="CLOSED DEALS"
        value={closedDeals}
        color="bg-green-600"
        index={5}
      />
    </motion.div>
  )
}
