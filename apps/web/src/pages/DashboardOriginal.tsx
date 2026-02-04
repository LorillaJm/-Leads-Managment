import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { FilterPanel } from '@/components/dashboard/FilterPanel'
import { OverviewPanel } from '@/components/dashboard/OverviewPanel'
import { ConversionFlowPanel } from '@/components/dashboard/ConversionFlowPanel'
import { SalesTeamTable } from '@/components/dashboard/SalesTeamTable'

export function DashboardOriginal() {
  const [selectedYear, setSelectedYear] = useState('2026')
  const [selectedMonths, setSelectedMonths] = useState(['ALL'])
  const [selectedConsultant, setSelectedConsultant] = useState('ALL')

  // Fetch dashboard data
  const { data: statsData } = useQuery({
    queryKey: ['dashboard-stats', selectedYear, selectedMonths, selectedConsultant],
    queryFn: () => api.getDashboardStats({
      year: selectedYear,
      months: selectedMonths,
      consultant: selectedConsultant
    }),
  })

  const stats = (statsData as any)?.data || {}

  // Mock sales consultants data
  const salesConsultants = [
    { id: '1', name: 'April Dream Galero' },
    { id: '2', name: 'Meryl Rose Martenor' },
    { id: '3', name: 'Mary Joy Lumanpac' },
    { id: '4', name: 'Ma. Angelica Canindo' },
    { id: '5', name: 'Ron Edward Santos' },
    { id: '6', name: 'Reynel Galiaza' },
    { id: '7', name: 'Karlyn Joy Lablero' },
    { id: '8', name: 'Joseph Besana' },
    { id: '9', name: 'Kurt Russell Gimotea' },
    { id: '10', name: 'Mary Angelle Francisco' },
  ]

  // Mock sales team data
  const salesTeamData = salesConsultants.map((consultant) => ({
    id: consultant.id,
    name: consultant.name,
    leads: Math.floor(Math.random() * 50) + 10,
    prospects: Math.floor(Math.random() * 30) + 5,
    testDrives: Math.floor(Math.random() * 20) + 2,
    reservations: Math.floor(Math.random() * 15) + 1,
    bankApplications: Math.floor(Math.random() * 10) + 1,
    closedDeals: Math.floor(Math.random() * 8) + 1,
  }))

  const handleMonthToggle = (month: string) => {
    if (month === 'ALL') {
      setSelectedMonths(['ALL'])
    } else {
      const newMonths = selectedMonths.includes(month)
        ? selectedMonths.filter((m) => m !== month && m !== 'ALL')
        : [...selectedMonths.filter((m) => m !== 'ALL'), month]
      
      setSelectedMonths(newMonths.length === 0 ? ['ALL'] : newMonths)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-[1800px] mx-auto">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-12 gap-4">
          {/* Left Sidebar - Scope (Filter Panel) */}
          <div className="col-span-12 lg:col-span-2">
            <FilterPanel
              selectedYear={selectedYear}
              selectedMonths={selectedMonths}
              selectedConsultant={selectedConsultant}
              onYearChange={setSelectedYear}
              onMonthToggle={handleMonthToggle}
              onConsultantChange={setSelectedConsultant}
              salesConsultants={salesConsultants}
            />
          </div>

          {/* Middle Section - Overview */}
          <div className="col-span-12 lg:col-span-2">
            <OverviewPanel
              totalCount={stats.totalLeads || 0}
              label="By count"
              leads={stats.totalLeads || 0}
              prospects={stats.totalProspects || 0}
              testDrives={stats.totalTestDrives || 0}
              reservations={stats.totalReservations || 0}
              bankApplications={stats.totalBankApplications || 0}
              closedDeals={stats.totalClosedDeals || 0}
              leadsGoal={1500}
            />
          </div>

          {/* Center Section - Conversion Flow */}
          <div className="col-span-12 lg:col-span-4">
            <ConversionFlowPanel
              leadsToProspects={stats.leadsToProspectsRate || 0}
              prospectsToClosedDeals={stats.prospectsToClosedDealsRate || 0}
              leadsToProspectsGoal={20}
              prospectsToClosedDealsGoal={25}
              testDrives={stats.totalTestDrives || 0}
              reservations={stats.totalReservations || 0}
              bankApplications={stats.totalBankApplications || 0}
              testDrivesMin={300}
              reservationsMin={120}
              bankApplicationsMin={180}
            />
          </div>

          {/* Right Section - Sales Team Table */}
          <div className="col-span-12 lg:col-span-4">
            <SalesTeamTable
              data={salesTeamData}
              totalCount={salesTeamData.length}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
