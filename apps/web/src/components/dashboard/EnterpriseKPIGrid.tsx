interface EnterpriseKPIGridProps {
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
}

function KPICard({ label, value, goal }: KPICardProps) {
  return (
    <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-[10px] p-3 h-[80px] flex flex-col justify-center hover:border-[#D1D5DB] transition-colors">
      <div className="text-[24px] font-semibold text-[#111827] leading-none mb-1">
        {value.toLocaleString()}
      </div>
      <div className="text-[11px] font-medium text-[#6B7280] uppercase tracking-wide">
        {label}
      </div>
      {goal && (
        <div className="text-[10px] text-[#9CA3AF] mt-0.5">
          Goal: {goal.toLocaleString()}
        </div>
      )}
    </div>
  )
}

export function EnterpriseKPIGrid({
  leads,
  prospects,
  testDrives,
  reservations,
  bankApplications,
  closedDeals,
  leadsGoal = 1500,
}: EnterpriseKPIGridProps) {
  return (
    <div className="bg-white rounded-[10px] border border-[#E5E7EB] shadow-[0_1px_2px_0_rgb(0_0_0_/0.03)] h-full overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-[#F9FAFB] px-4 py-3 border-b border-[#E5E7EB]">
        <h3 className="text-[13px] font-semibold text-[#111827]">Overview</h3>
        <p className="text-[10px] text-[#6B7280] mt-0.5">By count</p>
      </div>

      {/* KPI Grid - 2 rows × 3 columns (FLAT, NOT VERTICAL) */}
      <div className="flex-1 p-4">
        <div className="grid grid-cols-3 grid-rows-2 gap-3 h-full">
          <KPICard label="Leads" value={leads} goal={leadsGoal} />
          <KPICard label="Prospects" value={prospects} />
          <KPICard label="Test Drives" value={testDrives} />
          <KPICard label="Reservations" value={reservations} />
          <KPICard label="Bank Apps" value={bankApplications} />
          <KPICard label="Closed Deals" value={closedDeals} />
        </div>
      </div>
    </div>
  )
}
