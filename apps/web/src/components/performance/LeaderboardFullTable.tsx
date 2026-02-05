import { motion } from 'framer-motion'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from '@tanstack/react-table'
import { useState } from 'react'
import { ArrowUpDown, TrendingUp, TrendingDown, Minus, Trophy, Medal, Award } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ConsultantRanking {
  consultant: {
    id: string
    name: string
    email: string
  }
  metrics: {
    totalLeads: number
    prospects?: number
    testDrives?: number
    reservations?: number
    bankApplications?: number
    closedDeals: number
    conversionRate: number
    totalRevenue?: number
  }
  previousMetrics?: {
    totalLeads: number
    prospects?: number
    testDrives?: number
    reservations?: number
    bankApplications?: number
    closedDeals: number
    conversionRate: number
    totalRevenue?: number
  }
}

interface LeaderboardFullTableProps {
  data: ConsultantRanking[]
  compareMode?: boolean
  currentUserId?: string
}

const columnHelper = createColumnHelper<ConsultantRanking>()

export function LeaderboardFullTable({
  data,
  compareMode = false,
  currentUserId,
}: LeaderboardFullTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'metrics.closedDeals', desc: true },
  ])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-amber-500" />
      case 2:
        return <Medal className="w-5 h-5 text-slate-400" />
      case 3:
        return <Award className="w-5 h-5 text-amber-700 dark:text-amber-500" />
      default:
        return null
    }
  }

  const getRankBadge = (rank: number) => {
    const baseClass = 'font-semibold text-sm px-3 py-1.5 rounded-full min-w-[3rem] text-center'
    switch (rank) {
      case 1:
        return (
          <div
            className={cn(
              baseClass,
              'bg-gradient-to-br from-amber-500/20 to-amber-600/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
            )}
          >
            #{rank}
          </div>
        )
      case 2:
        return (
          <div
            className={cn(
              baseClass,
              'bg-gradient-to-br from-slate-400/20 to-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-400/30'
            )}
          >
            #{rank}
          </div>
        )
      case 3:
        return (
          <div
            className={cn(
              baseClass,
              'bg-gradient-to-br from-amber-700/20 to-amber-800/10 text-amber-700 dark:text-amber-500 border border-amber-700/30'
            )}
          >
            #{rank}
          </div>
        )
      default:
        return (
          <div
            className={cn(
              baseClass,
              'bg-muted/50 text-muted-foreground border border-border/50'
            )}
          >
            #{rank}
          </div>
        )
    }
  }

  const getChangeIndicator = (current: number, previous?: number) => {
    if (!previous || previous === 0) return null
    const change = current - previous
    const percentChange = ((change / previous) * 100).toFixed(1)

    if (change > 0) {
      return (
        <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
          <TrendingUp className="w-3 h-3" />
          <span className="text-xs font-medium">+{percentChange}%</span>
        </div>
      )
    } else if (change < 0) {
      return (
        <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
          <TrendingDown className="w-3 h-3" />
          <span className="text-xs font-medium">{percentChange}%</span>
        </div>
      )
    }
    return (
      <div className="flex items-center gap-1 text-muted-foreground">
        <Minus className="w-3 h-3" />
        <span className="text-xs font-medium">0%</span>
      </div>
    )
  }

  const columns = [
    columnHelper.display({
      id: 'rank',
      header: 'Rank',
      cell: (info) => {
        const rank = info.row.index + 1
        return (
          <div className="flex items-center gap-3">
            {getRankBadge(rank)}
            {getRankIcon(rank)}
          </div>
        )
      },
    }),
    columnHelper.accessor('consultant.name', {
      header: 'Sales Consultant',
      cell: (info) => {
        const isCurrentUser =
          currentUserId && info.row.original.consultant.id === currentUserId
        return (
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-base">{info.getValue()}</p>
              {isCurrentUser && (
                <Badge
                  variant="default"
                  className="text-xs bg-primary/20 text-primary border-primary/30"
                >
                  You
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {info.row.original.consultant.email}
            </p>
          </div>
        )
      },
    }),
    columnHelper.accessor('metrics.totalLeads', {
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-foreground transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Leads
          <ArrowUpDown className="w-4 h-4" />
        </button>
      ),
      cell: (info) => (
        <div>
          <p className="font-semibold text-lg">{info.getValue()}</p>
          {compareMode && info.row.original.previousMetrics && (
            <div className="mt-1">
              {getChangeIndicator(
                info.getValue(),
                info.row.original.previousMetrics.totalLeads
              )}
            </div>
          )}
        </div>
      ),
    }),
    columnHelper.accessor('metrics.prospects', {
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-foreground transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Prospects
          <ArrowUpDown className="w-4 h-4" />
        </button>
      ),
      cell: (info) => {
        const value = info.getValue()
        if (value === undefined) return <span className="text-muted-foreground">-</span>
        return (
          <div>
            <p className="font-semibold text-lg">{value}</p>
            {compareMode && info.row.original.previousMetrics?.prospects && (
              <div className="mt-1">
                {getChangeIndicator(value, info.row.original.previousMetrics.prospects)}
              </div>
            )}
          </div>
        )
      },
    }),
    columnHelper.accessor('metrics.testDrives', {
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-foreground transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Test Drives
          <ArrowUpDown className="w-4 h-4" />
        </button>
      ),
      cell: (info) => {
        const value = info.getValue()
        if (value === undefined) return <span className="text-muted-foreground">-</span>
        return (
          <div>
            <p className="font-semibold text-lg">{value}</p>
            {compareMode && info.row.original.previousMetrics?.testDrives && (
              <div className="mt-1">
                {getChangeIndicator(value, info.row.original.previousMetrics.testDrives)}
              </div>
            )}
          </div>
        )
      },
    }),
    columnHelper.accessor('metrics.reservations', {
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-foreground transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Reservations
          <ArrowUpDown className="w-4 h-4" />
        </button>
      ),
      cell: (info) => {
        const value = info.getValue()
        if (value === undefined) return <span className="text-muted-foreground">-</span>
        return (
          <div>
            <p className="font-semibold text-lg">{value}</p>
            {compareMode && info.row.original.previousMetrics?.reservations && (
              <div className="mt-1">
                {getChangeIndicator(
                  value,
                  info.row.original.previousMetrics.reservations
                )}
              </div>
            )}
          </div>
        )
      },
    }),
    columnHelper.accessor('metrics.bankApplications', {
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-foreground transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Bank Apps
          <ArrowUpDown className="w-4 h-4" />
        </button>
      ),
      cell: (info) => {
        const value = info.getValue()
        if (value === undefined) return <span className="text-muted-foreground">-</span>
        return (
          <div>
            <p className="font-semibold text-lg">{value}</p>
            {compareMode && info.row.original.previousMetrics?.bankApplications && (
              <div className="mt-1">
                {getChangeIndicator(
                  value,
                  info.row.original.previousMetrics.bankApplications
                )}
              </div>
            )}
          </div>
        )
      },
    }),
    columnHelper.accessor('metrics.closedDeals', {
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-foreground transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Closed Deals
          <ArrowUpDown className="w-4 h-4" />
        </button>
      ),
      cell: (info) => (
        <div>
          <p className="font-semibold text-lg text-emerald-600 dark:text-emerald-400">
            {info.getValue()}
          </p>
          {compareMode && info.row.original.previousMetrics && (
            <div className="mt-1">
              {getChangeIndicator(
                info.getValue(),
                info.row.original.previousMetrics.closedDeals
              )}
            </div>
          )}
        </div>
      ),
    }),
    columnHelper.accessor('metrics.conversionRate', {
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-foreground transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Conversion
          <ArrowUpDown className="w-4 h-4" />
        </button>
      ),
      cell: (info) => (
        <div>
          <Badge
            variant="secondary"
            className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 font-semibold text-base px-3 py-1"
          >
            {info.getValue()}%
          </Badge>
          {compareMode && info.row.original.previousMetrics && (
            <div className="mt-1">
              {getChangeIndicator(
                info.getValue(),
                info.row.original.previousMetrics.conversionRate
              )}
            </div>
          )}
        </div>
      ),
    }),
  ]

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground rounded-xl border border-border/50 bg-muted/10">
        <div className="text-center space-y-2">
          <Trophy className="w-12 h-12 mx-auto text-muted-foreground/50" />
          <p className="text-lg font-medium">No ranking data available</p>
          <p className="text-sm">Sales consultant rankings will appear here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border/50 overflow-hidden bg-background/60 backdrop-blur-xl shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10">
              <tr className="border-b border-border/50 bg-muted/50 backdrop-blur-sm">
                {table.getHeaderGroups().map((headerGroup) =>
                  headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground uppercase tracking-wider"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))
                )}
              </tr>
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, index) => {
                const isCurrentUser =
                  currentUserId && row.original.consultant.id === currentUserId
                const isTopThree = index < 3
                return (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={cn(
                      'border-b border-border/30 hover:bg-muted/30 transition-all duration-200',
                      isTopThree && 'bg-muted/10',
                      isCurrentUser &&
                        'bg-primary/5 border-primary/20 ring-2 ring-primary/10 hover:bg-primary/10'
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
