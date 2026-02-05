interface EnterpriseMetricsPanelProps {
  testDrives: number
  reservations: number
  bankApplications: number
  leadsToProspects: number
  prospectsToClosedDeals: number
  overallConversion: number
  testDrivesMin?: number
  reservationsMin?: number
  bankApplicationsMin?: number
}

interface MetricRowProps {
  label: string
  value: string | number
  meta?: string
  status?: 'good' | 'warning' | 'neutral'
}

function MetricRow({ label, value, meta, status = 'neutral' }: MetricRowProps) {
  const statusColor = {
    good: 'text-[#059669]',
    warning: 'text-[#F59E0B]',
    neutral: 'text-[#111827]'
  }[status]

  return (
    <div className="flex items-center justify-between py-2 border-b border-[#F3F4F6] last:border-0">
      <span className="text-[11px] font-medium text-[#6B7280]">{label}</span>
      <div className="text-right">
        <div className={`text-[13px] font-semibold ${statusColor}`}>
          {value}
        </div>
        {meta && (
          <div className="text-[10px] text-[#9CA3AF]">{meta}</div>
        )}
      </div>
    </div>
  )
}

export function EnterpriseMetricsPanel({
  testDrives,
  reservations,
  bankApplications,
  leadsToProspects,
  prospectsToClosedDeals,
  overallConversion,
  testDrivesMin = 300,
  reservationsMin = 120,
  bankApplicationsMin = 180,
}: EnterpriseMetricsPanelProps) {
  return (
    <div className="bg-white rounded-[10px] border border-[#E5E7EB] shadow-[0_1px_2px_0_rgb(0_0_0_/0.03)] overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="bg-[#F9FAFB] px-4 py-3 border-b border-[#E5E7EB]">
        <h3 className="text-[13px] font-semibold text-[#111827]">Conversion Metrics</h3>
        <p className="text-[10px] text-[#6B7280] mt-0.5">Key performance indicators</p>
      </div>

      {/* Metrics List - Dense, readable */}
      <div className="flex-1 p-4">
        <div className="space-y-0">
          <MetricRow 
            label="Test Drives" 
            value={testDrives.toLocaleString()} 
            meta={`Min: ${testDrivesMin}`}
            status={testDrives >= testDrivesMin ? 'good' : 'warning'}
          />
          <MetricRow 
            label="Reservations" 
            value={reservations.toLocaleString()} 
            meta={`Min: ${reservationsMin}`}
            status={reservations >= reservationsMin ? 'good' : 'warning'}
          />
          <MetricRow 
            label="Bank Applications" 
            value={bankApplications.toLocaleString()} 
            meta={`Min: ${bankApplicationsMin}`}
            status={bankApplications >= bankApplicationsMin ? 'good' : 'warning'}
          />
          <MetricRow 
            label="Leads → Prospects" 
            value={`${leadsToProspects}%`} 
            meta="Goal: 20%"
            status={leadsToProspects >= 20 ? 'good' : 'neutral'}
          />
          <MetricRow 
            label="Prospects → Closed" 
            value={`${prospectsToClosedDeals}%`} 
            meta="Goal: 25%"
            status={prospectsToClosedDeals >= 25 ? 'good' : 'neutral'}
          />
          <MetricRow 
            label="Overall Conversion" 
            value={`${overallConversion}%`} 
            meta="Leads to Closed"
            status="neutral"
          />
        </div>
      </div>
    </div>
  )
}
