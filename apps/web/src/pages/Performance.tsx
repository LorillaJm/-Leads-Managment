import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MonthlyPerformanceChart } from '@/components/performance/MonthlyPerformanceChart'
import { MonthlyDataTable } from '@/components/performance/MonthlyDataTable'
import { InterestLevelsChart } from '@/components/performance/InterestLevelsChart'
import { LeadsSourceChart } from '@/components/performance/LeadsSourceChart'
import { VehicleModelsChart } from '@/components/performance/VehicleModelsChart'
import { ColorsChart } from '@/components/performance/ColorsChart'

export function Performance() {
  // Mock data matching the screenshot
  const monthlyData = [
    { month: 'JAN', leads: 0, prospects: 0, testDrives: 0, reservations: 0, bankApplications: 0, closedDeals: 14 },
    { month: 'FEB', leads: 0, prospects: 0, testDrives: 0, reservations: 0, bankApplications: 0, closedDeals: 24 },
    { month: 'MAR', leads: 0, prospects: 0, testDrives: 0, reservations: 0, bankApplications: 0, closedDeals: 16 },
    { month: 'APR', leads: 0, prospects: 0, testDrives: 0, reservations: 0, bankApplications: 0, closedDeals: 18 },
    { month: 'MAY', leads: 0, prospects: 0, testDrives: 0, reservations: 0, bankApplications: 0, closedDeals: 23 },
    { month: 'JUN', leads: 0, prospects: 0, testDrives: 0, reservations: 0, bankApplications: 0, closedDeals: 29 },
    { month: 'JUL', leads: 0, prospects: 0, testDrives: 0, reservations: 0, bankApplications: 0, closedDeals: 30 },
    { month: 'AUG', leads: 0, prospects: 0, testDrives: 0, reservations: 0, bankApplications: 0, closedDeals: 24 },
    { month: 'SEP', leads: 277, prospects: 172, testDrives: 61, reservations: 40, bankApplications: 37, closedDeals: 26 },
    { month: 'OCT', leads: 154, prospects: 90, testDrives: 36, reservations: 25, bankApplications: 42, closedDeals: 37 },
    { month: 'NOV', leads: 115, prospects: 65, testDrives: 42, reservations: 12, bankApplications: 34, closedDeals: 26 },
    { month: 'DEC', leads: 177, prospects: 66, testDrives: 25, reservations: 12, bankApplications: 33, closedDeals: 33 },
  ]

  const interestLevelsData = [
    { level: 'Hot (very interested and will con...', count: 726 },
    { level: 'Warm (interested)', count: 243 },
    { level: 'Cold (little to no interest)', count: 190 },
    { level: 'Just looking', count: 0 },
  ]

  const leadsSourceData = [
    { source: 'Walk-in / Referral', count: 431 },
    { source: 'Facebook', count: 122 },
    { source: 'Mail / Banks', count: 316 },
    { source: 'Web (Ayala)', count: 312 },
  ]

  const vehicleModelsData = [
    { model: 'Atto 3 Dynamic', inquiryCount: 45, closedDeals: 8 },
    { model: 'Atto 3 Premium', inquiryCount: 38, closedDeals: 7 },
    { model: 'Dolphin', inquiryCount: 52, closedDeals: 9 },
    { model: 'eMax7 Standard', inquiryCount: 28, closedDeals: 5 },
    { model: 'eMax7 Superior Captain', inquiryCount: 35, closedDeals: 6 },
    { model: 'eMax9 DM-i Advanced', inquiryCount: 42, closedDeals: 7 },
    { model: 'eMax9 DM-i Premium', inquiryCount: 48, closedDeals: 8 },
    { model: 'Han', inquiryCount: 65, closedDeals: 11 },
    { model: 'Seagull', inquiryCount: 32, closedDeals: 5 },
    { model: 'Seal 5 DM-i Dynamic', inquiryCount: 38, closedDeals: 6 },
    { model: 'Seal 5 DM-i Premium', inquiryCount: 44, closedDeals: 7 },
    { model: 'Seal Performance', inquiryCount: 55, closedDeals: 9 },
    { model: 'Seal Advanced', inquiryCount: 48, closedDeals: 8 },
    { model: 'Sealion 5 DM-i', inquiryCount: 72, closedDeals: 12 },
    { model: 'Sealion 6 DM-i', inquiryCount: 88, closedDeals: 15 },
    { model: 'Shark 6 DMO Advanced', inquiryCount: 58, closedDeals: 10 },
    { model: 'Shark 6 DMO Premium', inquiryCount: 62, closedDeals: 11 },
    { model: 'Tang EV', inquiryCount: 68, closedDeals: 12 },
    { model: 'Tang DM-i', inquiryCount: 75, closedDeals: 13 },
  ]

  const colorsData = [
    { color: 'White', count: 250, percentage: 21.8 },
    { color: 'Gray', count: 180, percentage: 15.7 },
    { color: 'Black', count: 150, percentage: 13.1 },
    { color: 'Blue', count: 120, percentage: 10.5 },
    { color: 'Green', count: 80, percentage: 7.0 },
    { color: 'Undecided', count: 369, percentage: 32.2 },
  ]

  return (
    <div className="space-y-6 pb-8">
      {/* Compact Analytics Grid - Desktop: 12-column responsive layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        
        {/* Row 1: Interest Levels (3 cols) + Vehicle Models (6 cols) + Colors (3 cols) */}
        
        {/* Interest Levels - Left Column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-3"
        >
          <Card className="bg-background/60 backdrop-blur-xl border-border/50 shadow-lg h-full flex flex-col">
            <CardHeader className="border-b border-border/50 pb-3 flex-shrink-0">
              <CardTitle className="text-base font-semibold">Interest Levels</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 flex-1 flex flex-col min-h-0">
              <InterestLevelsChart data={interestLevelsData} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Vehicle Models - Center Wide Column (Primary Focus) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-6"
        >
          <Card className="bg-background/60 backdrop-blur-xl border-border/50 shadow-lg h-full flex flex-col">
            <CardHeader className="border-b border-border/50 pb-3 flex-shrink-0">
              <CardTitle className="text-base font-semibold">Vehicle Models</CardTitle>
              <p className="text-xs text-muted-foreground">By leads inquiry interest and closed deals</p>
            </CardHeader>
            <CardContent className="pt-4 flex-1 flex flex-col min-h-0">
              <VehicleModelsChart data={vehicleModelsData} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Colors - Right Column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-3"
        >
          <Card className="bg-background/60 backdrop-blur-xl border-border/50 shadow-lg h-full flex flex-col">
            <CardHeader className="border-b border-border/50 pb-3 flex-shrink-0">
              <CardTitle className="text-base font-semibold">Colors</CardTitle>
              <p className="text-xs text-muted-foreground">By leads enquiry interest</p>
            </CardHeader>
            <CardContent className="pt-4 flex-1 flex flex-col min-h-0">
              <ColorsChart data={colorsData} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Row 2: Leads Source (Full Width Below) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-12"
        >
          <Card className="bg-background/60 backdrop-blur-xl border-border/50 shadow-lg">
            <CardHeader className="border-b border-border/50 pb-3">
              <CardTitle className="text-base font-semibold">Leads Source</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <LeadsSourceChart data={leadsSourceData} />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Performance Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-blue-600/95 to-blue-700/95 backdrop-blur-xl border-blue-500/50 shadow-2xl">
          <CardHeader className="border-b border-white/20 pb-4">
            <CardTitle className="text-2xl font-bold text-white">
              2025 Monthly Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Chart Section - Takes 2 columns */}
              <div className="xl:col-span-2">
                <div className="bg-white/95 dark:bg-gray-900/95 rounded-lg p-4">
                  <div className="mb-4">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                      Overall Monthly Performance Trend
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      By Leads, Prospects, Test Drives, Reservations, Bank Applications, and Closed Deals
                    </p>
                  </div>
                  <MonthlyPerformanceChart data={monthlyData} />
                </div>
              </div>

              {/* Table Section - Takes 1 column */}
              <div className="xl:col-span-1">
                <div className="bg-white/95 dark:bg-gray-900/95 rounded-lg p-4 h-full">
                  <MonthlyDataTable data={monthlyData} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
