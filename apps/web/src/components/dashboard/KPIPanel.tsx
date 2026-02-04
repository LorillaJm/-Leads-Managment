import { motion } from 'framer-motion'
import { Users, TrendingUp, Car, FileText, Building2, CheckCircle } from 'lucide-react'

interface KPICardProps {
  label: string
  value: number
  goal?: number
  color: string
  index: number
  icon: any
  collapsed?: boolean
}

function KPICard({ label, value, goal, color, index, icon: Icon, collapsed }: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`${color} rounded-lg p-3 shadow-md hover:shadow-lg transition-all duration-300 ${collapsed ? 'flex items-center justify-center' : ''}`}
      title={collapsed ? `${label}: ${value}` : ''}
    >
      {collapsed ? (
        <div className="text-center">
          <Icon className="w-6 h-6 text-white mx-auto mb-1" />
          <div className="text-lg font-bold text-white">{value}</div>
        </div>
      ) : (
        <div className="text-center">
          <Icon className="w-8 h-8 text-white mx-auto mb-2" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.05 + 0.2, type: 'spring', stiffness: 200 }}
            className="text-3xl font-bold text-white mb-1"
          >
            {value}
          </motion.div>
          <div className="text-xs font-bold text-white uppercase tracking-wide">
            {label}
          </div>
          {goal && (
            <div className="text-xs text-white/90 mt-1 font-medium">
              (Goal: {goal})
            </div>
          )}
        </div>
      )}
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
  collapsed?: boolean
}

export function KPIPanel({
  leads,
  prospects,
  testDrives,
  reservations,
  bankApplications,
  closedDeals,
  leadsGoal = 1500,
  collapsed = false,
}: KPIPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-2"
    >
      <KPICard
        label="LEADS"
        value={leads}
        goal={leadsGoal}
        color="bg-gradient-to-br from-gray-700 to-gray-800"
        icon={Users}
        index={0}
        collapsed={collapsed}
      />
      <KPICard
        label="PROSPECTS"
        value={prospects}
        color="bg-gradient-to-br from-blue-500 to-blue-600"
        icon={TrendingUp}
        index={1}
        collapsed={collapsed}
      />
      <KPICard
        label="TEST DRIVES"
        value={testDrives}
        color="bg-gradient-to-br from-blue-400 to-blue-500"
        icon={Car}
        index={2}
        collapsed={collapsed}
      />
      <KPICard
        label="RESERVATIONS"
        value={reservations}
        color="bg-gradient-to-br from-blue-300 to-blue-400"
        icon={FileText}
        index={3}
        collapsed={collapsed}
      />
      <KPICard
        label="BANK APPLICATIONS"
        value={bankApplications}
        color="bg-gradient-to-br from-yellow-500 to-yellow-600"
        icon={Building2}
        index={4}
        collapsed={collapsed}
      />
      <KPICard
        label="CLOSED DEALS"
        value={closedDeals}
        color="bg-gradient-to-br from-green-600 to-green-700"
        icon={CheckCircle}
        index={5}
        collapsed={collapsed}
      />
    </motion.div>
  )
}
