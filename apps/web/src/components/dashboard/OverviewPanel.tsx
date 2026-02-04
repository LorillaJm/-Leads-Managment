import { motion } from 'framer-motion'

interface OverviewPanelProps {
  totalCount: number
  label: string
}

export function OverviewPanel({ totalCount, label }: OverviewPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow h-full"
    >
      <h3 className="text-base font-bold text-gray-900 mb-3">Overview</h3>
      <div className="text-center">
        <div className="text-xs text-gray-600 mb-2">{label}</div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2, stiffness: 200 }}
          className="text-5xl font-bold text-gray-900"
        >
          {totalCount}
        </motion.div>
      </div>
    </motion.div>
  )
}
