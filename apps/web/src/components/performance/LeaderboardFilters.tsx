import { Calendar, RefreshCw, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

interface LeaderboardFiltersProps {
  selectedPeriod: string
  onPeriodChange: (period: string) => void
  selectedMetric: string
  onMetricChange: (metric: string) => void
  compareMode: boolean
  onCompareModeToggle: () => void
  onRefresh: () => void
  isLoading?: boolean
}

export function LeaderboardFilters({
  selectedPeriod,
  onPeriodChange,
  selectedMetric,
  onMetricChange,
  compareMode,
  onCompareModeToggle,
  onRefresh,
  isLoading = false,
}: LeaderboardFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-muted/30 rounded-xl border border-border/50">
      <div className="flex flex-wrap items-center gap-3">
        {/* Period Selector */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <Select value={selectedPeriod} onValueChange={onPeriodChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Metric Selector */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={selectedMetric} onValueChange={onMetricChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Rank by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="closedDeals">Closed Deals</SelectItem>
              <SelectItem value="totalLeads">Total Leads</SelectItem>
              <SelectItem value="conversionRate">Conversion Rate</SelectItem>
              <SelectItem value="revenue">Revenue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Compare Mode Toggle */}
        <Button
          variant={compareMode ? 'default' : 'outline'}
          size="sm"
          onClick={onCompareModeToggle}
          className="gap-2"
        >
          {compareMode ? (
            <>
              <Badge variant="success" className="px-2 py-0.5">
                ON
              </Badge>
              Compare Mode
            </>
          ) : (
            <>Compare Mode</>
          )}
        </Button>
      </div>

      {/* Refresh Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        disabled={isLoading}
        className="gap-2"
      >
        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        Refresh
      </Button>
    </div>
  )
}
