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

interface RankingData {
  consultant: {
    id: string
    name: string
    email: string
  }
  metrics: {
    totalLeads: number
    closedDeals: number
    conversionRate: number
    totalRevenue: number
  }
  previousMetrics?: {
    totalLeads: number
    closedDeals: number
    conversionRate: number
    totalRevenue: number
  }
}

interface RankingTableProps {
  data: RankingData[]
  compareMode: boolean
  currentUserId?: string
}

const columnHelper = createColumnHelper<RankingData>()

export function RankingTable({ data, compareMode, currentUserId }: RankingTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-amber-500" />
      case 2:
        return <Medal className="w-5 h-5 text-slate-400" />
      case 3:
        return <Award className="w-5 h-5 text-amber-700" />
      default:
        return null
    }
  }

  const getRankBadge = (rank: number) => {
    const baseClass = "font-semibold text-sm px-3 py-1 rounded-full"
    switch (rank) {
      case 1:
        return (
          <div className={cn(baseClass, "bg-gradient-to-br from-amber-500/20 to-amber-600/10 text-amber-600 dark:text-amber-400 border border-amber-500/30")}>
            #{rank}
          </div>
        )
      case 2:
        return (
          <div className={cn(baseClass, "bg-gradient-to-br from-slate-400/20 to-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-400/30")}>
            #{rank}
          </div>
        )
      case 3:
        return (
          <div className={cn(baseClass, "bg-gradient-to-br from-amber-700/20 to-amber-800/10 text-amber-700 dark:text-amber-500 border border-amber-700/30")}>
            #{rank}
          </div>
        )
      default:
        return (
          <div className={cn(baseClass, "bg-muted/50 text-muted-foreground border border-border/50")}>
            #{rank}
          </div>
        )
    }
  }

  const getChangeIndicator = (current: number, previous: number) => {
    if (!previous) return null
    const change = current - previous
    const percentChange = previous > 0 ? ((change / previous) * 100).toFixed(1) : '0.0'

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
        const isCurrentUser = currentUserId && info.row.original.consultant.id === currentUserId
        return (
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">{info.getValue()}</p>
              {isCurrentUser && (
                <Badge variant="default" className="text-xs bg-primary/20 text-primary border-primary/30">
                  You
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{info.row.original.consultant.email}</p>
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
          Total Leads
          <ArrowUpDown className="w-4 h-4" />
        </button>
      ),
      cell: (info) => (
        <div>
          <p className="font-semibold text-lg">{info.getValue()}</p>
          {compareMode && info.row.original.previousMetrics && (
            getChangeIndicator(info.getValue(), info.row.original.previousMetrics.totalLeads)
          )}
        </div>
      ),
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
          <p className="font-semibold text-lg text-emerald-600 dark:text-emerald-400">{info.getValue()}</p>
          {compareMode && info.row.original.previousMetrics && (
            getChangeIndicator(info.getValue(), info.row.original.previousMetrics.closedDeals)
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
          Conversion %
          <ArrowUpDown className="w-4 h-4" />
        </button>
      ),
      cell: (info) => (
        <div>
          <Badge variant="secondary" className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 font-semibold">
            {info.getValue()}%
          </Badge>
          {compareMode && info.row.original.previousMetrics && (
            <div className="mt-1">
              {getChangeIndicator(info.getValue(), info.row.original.previousMetrics.conversionRate)}
            </div>
          )}
        </div>
      ),
    }),
    columnHelper.accessor('metrics.totalRevenue', {
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 hover:text-foreground transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Total Revenue
          <ArrowUpDown className="w-4 h-4" />
        </button>
      ),
      cell: (info) => (
        <div>
          <p className="font-semibold text-lg">${info.getValue().toLocaleString()}</p>
          {compareMode && info.row.original.previousMetrics && (
            getChangeIndicator(info.getValue(), info.row.original.previousMetrics.totalRevenue)
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
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        <div className="text-center space-y-2">
          <p className="text-lg font-medium">No ranking data available</p>
          <p className="text-sm">Sales consultant rankings will appear here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30">
                {table.getHeaderGroups().map((headerGroup) =>
                  headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground"
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
                const isCurrentUser = currentUserId && row.original.consultant.id === currentUserId
                return (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "border-b border-border/30 hover:bg-muted/20 transition-colors",
                      index < 3 && "bg-muted/10",
                      isCurrentUser && "bg-primary/5 border-primary/20 ring-2 ring-primary/10"
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

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 pt-4">
        <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
          <p className="text-sm text-muted-foreground">Total Leads</p>
          <p className="text-2xl font-semibold mt-1">
            {data.reduce((sum, item) => sum + item.metrics.totalLeads, 0)}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
          <p className="text-sm text-muted-foreground">Total Closed</p>
          <p className="text-2xl font-semibold mt-1 text-emerald-600 dark:text-emerald-400">
            {data.reduce((sum, item) => sum + item.metrics.closedDeals, 0)}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
          <p className="text-sm text-muted-foreground">Avg Conversion</p>
          <p className="text-2xl font-semibold mt-1">
            {(data.reduce((sum, item) => sum + item.metrics.conversionRate, 0) / data.length).toFixed(1)}%
          </p>
        </div>
        <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-2xl font-semibold mt-1">
            ${data.reduce((sum, item) => sum + item.metrics.totalRevenue, 0).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}
