import { motion } from 'framer-motion'

interface ActivityBreakdownPanelProps {
  testDrives: number
  reservations: number
  bankApplications: number
  testDrivesMin?: number
  reservationsMin?: number
  bankApplicationsMin?: number
}

export function ActivityBreakdownPanel({
  testDrives,
  reservations,
  bankApplications,
  testDrivesMin = 300,
  reservationsMin = 120,
  bankApplicationsMin = 180,
}: ActivityBreakdownPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-lg border border-gray-200 p-6"
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="border border-gray-200 rounded p-4">
          <div className="text-sm font-semibold text-gray-700 mb-2">
            Test Drives
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {testDrives}
          </div>
          <div className="text-xs text-gray-500">
            Minimum: {testDrivesMin}
          </div>
        </div>

        <div className="border border-gray-200 rounded p-4">
          <div className="text-sm font-semibold text-gray-700 mb-2">
            Reservations
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {reservations}
          </div>
          <div className="text-xs text-gray-500">
            Minimum: {reservationsMin}
          </div>
        </div>

        <div className="border border-gray-200 rounded p-4 col-span-2">
          <div className="text-sm font-semibold text-gray-700 mb-2">
            Bank Applications
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {bankApplications}
          </div>
          <div className="text-xs text-gray-500">
            Minimum: {bankApplicationsMin}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
