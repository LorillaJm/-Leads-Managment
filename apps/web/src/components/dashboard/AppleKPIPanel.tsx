interface AppleKPIPanelProps {
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
  gradient: string
}

function KPICard({ label, value, goal, gradient }: KPICardProps) {
  return (
    <div
      className={`${gradient} rounded-lg p-4 shadow-[0_1px_2px_0_rgb(0_0_0_/0.05)] hover:shadow-[0_2px_8px_0_rgb(0_0_0_/0.04)] hover:scale-[1.02] transition-all duration-200`}
    >
      <div className="text-center">
        <div className="text-2xl font-semibold text-white mb-1 tracking-tight">
          {value.toLocaleString()}
        </div>
        <div className="text-[10px] font-semibold text-white/90 uppercase tracking-wider">
          {label}
        </div>
        {goal && (
          <div className="text-[9px] text-white/70 mt-1 font-medium">
            Goal: {goal.toLocaleString()}
          </div>
        )}
      </div>
    </div>
  )
}

export function AppleKPIPanel({
  leads,
  prospects,
  testDrives,
  reservations,
  bankApplications,
  closedDeals,
  leadsGoal = 1500,
}: AppleKPIPanelProps) {
  return (
    <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-[0_1px_2px_0_rgb(0_0_0_/0.05)] overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="bg-[#F5F5F5] px-4 py-3 border-b border-[#E5E5E5]">
        <h3 className="text-xs font-semibold text-[#171717] tracking-tight">Overview</h3>
        <p className="text-[10px] text-[#757575] mt-0.5">By count</p>
      </div>

      {/* KPI Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          <KPICard
            label="LEADS"
            value={leads}
            goal={leadsGoal}
            gradient="bg-gradient-to-br from-[#334155] to-[#1E293B]"
          />
          <KPICard
            label="PROSPECTS"
            value={prospects}
            gradient="bg-gradient-to-br from-[#3B82F6] to-[#2563EB]"
          />
          <KPICard
            label="TEST DRIVES"
            value={testDrives}
            gradient="bg-gradient-to-br from-[#60A5FA] to-[#3B82F6]"
          />
          <KPICard
            label="RESERVATIONS"
            value={reservations}
            gradient="bg-gradient-to-br from-[#93C5FD] to-[#60A5FA]"
          />
          <KPICard
            label="BANK APPS"
            value={bankApplications}
            gradient="bg-gradient-to-br from-[#F59E0B] to-[#D97706]"
          />
          <KPICard
            label="CLOSED DEALS"
            value={closedDeals}
            gradient="bg-gradient-to-br from-[#059669] to-[#047857]"
          />
        </div>
      </div>
    </div>
  )
}
