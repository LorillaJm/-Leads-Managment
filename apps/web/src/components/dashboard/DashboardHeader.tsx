import { motion } from 'framer-motion'

export function DashboardHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-gray-200 px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 text-white px-3 py-1.5 rounded font-bold text-sm">
              BYD
            </div>
            <div>
              <h1 className="text-sm font-semibold text-gray-500">
                LEADS <span className="text-green-600">DASHBOARD</span>
              </h1>
              <h2 className="text-lg font-bold text-gray-900">
                ADMIN | MANAGEMENT DASHBOARD
              </h2>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">
            Code:JonJonBre - DO NOT edit ranges with a warning
          </span>
          <span className="px-3 py-1 bg-gray-100 text-xs font-medium rounded">
            [TEMPLATE] BYD Iloilo SC Leads Management
          </span>
          <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">
            FOR ADMIN ONLY
          </span>
        </div>
      </div>
    </motion.div>
  )
}
