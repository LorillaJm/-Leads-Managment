import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  DollarSign, 
  TrendingUp, 
  Award, 
  Calendar as CalendarIcon,
  Download,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  FileSpreadsheet
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table'
import { format } from 'date-fns'
import { StatCard } from '@/components/ui/stat-card'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'

export function ClosedDeals() {
  const { toast } = useToast()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  // Filter states
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()
  const [modelFilter, setModelFilter] = useState('')
  const [scFilter, setScFilter] = useState('')

  const { data: dealsResponse, isLoading } = useQuery({
    queryKey: ['closed-deals'],
    queryFn: api.getClosedDeals,
  })

  const { data: usersResponse } = useQuery({
    queryKey: ['sales-consultants'],
    queryFn: api.getSalesConsultants,
  })

  const dealsArray = (dealsResponse as any)?.data?.closedDeals || []
  const salesConsultants = (usersResponse as any)?.data?.users || []

  // Calculate stats
  const totalRevenue = dealsArray.reduce((sum: number, deal: any) => sum + (deal.salePrice || 0), 0)
  const avgDealSize = dealsArray.length ? totalRevenue / dealsArray.length : 0
  const thisMonthDeals = dealsArray.filter((d: any) => {
    const date = new Date(d.dateReleased)
    const now = new Date()
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  }).length

  // Define columns
  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'dateReleased',
        header: ({ column }) => {
          return (
            <button
              className="flex items-center gap-2 hover:text-foreground transition-colors"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Date Released
              {column.getIsSorted() === 'asc' ? (
                <ChevronUp className="h-4 w-4" />
              ) : column.getIsSorted() === 'desc' ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronsUpDown className="h-4 w-4 opacity-50" />
              )}
            </button>
          )
        },
        cell: ({ row }) => (
          <div className="text-sm">
            {format(new Date(row.original.dateReleased), 'MMM dd, yyyy')}
          </div>
        ),
      },
      {
        accessorKey: 'lead',
        header: 'Customer',
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-sm">
              {row.original.lead?.firstName} {row.original.lead?.lastName}
            </p>
            <p className="text-xs text-muted-foreground">{row.original.lead?.email}</p>
          </div>
        ),
      },
      {
        accessorKey: 'interestedModel',
        header: ({ column }) => {
          return (
            <button
              className="flex items-center gap-2 hover:text-foreground transition-colors"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Model
              {column.getIsSorted() === 'asc' ? (
                <ChevronUp className="h-4 w-4" />
              ) : column.getIsSorted() === 'desc' ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronsUpDown className="h-4 w-4 opacity-50" />
              )}
            </button>
          )
        },
        cell: ({ row }) => (
          <div className="font-medium">{row.original.lead?.interestedModel}</div>
        ),
      },
      {
        accessorKey: 'chassisNumber',
        header: 'Chassis Number',
        cell: ({ row }) => (
          <div className="font-mono text-sm">{row.original.chassisNumber}</div>
        ),
      },
      {
        accessorKey: 'vsiNumber',
        header: 'VSI Number',
        cell: ({ row }) => (
          <div className="font-mono text-sm">{row.original.vsiNumber}</div>
        ),
      },
      {
        accessorKey: 'salePrice',
        header: ({ column }) => {
          return (
            <button
              className="flex items-center gap-2 hover:text-foreground transition-colors"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Sale Price
              {column.getIsSorted() === 'asc' ? (
                <ChevronUp className="h-4 w-4" />
              ) : column.getIsSorted() === 'desc' ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronsUpDown className="h-4 w-4 opacity-50" />
              )}
            </button>
          )
        },
        cell: ({ row }) => (
          <div className="font-semibold text-emerald-600 dark:text-emerald-400">
            ₱{row.original.salePrice?.toLocaleString() || 0}
          </div>
        ),
      },
      {
        accessorKey: 'assignedTo',
        header: 'Sales Consultant',
        cell: ({ row }) => (
          <div className="text-sm">
            {row.original.lead?.assignedTo?.firstName} {row.original.lead?.assignedTo?.lastName}
          </div>
        ),
      },
    ],
    []
  )

  // Filter data
  const filteredData = useMemo(() => {
    let filtered = [...dealsArray]

    // Date range filter
    if (startDate) {
      filtered = filtered.filter((deal: any) => 
        new Date(deal.dateReleased) >= startDate
      )
    }
    if (endDate) {
      filtered = filtered.filter((deal: any) => 
        new Date(deal.dateReleased) <= endDate
      )
    }

    // Model filter
    if (modelFilter) {
      filtered = filtered.filter((deal: any) =>
        deal.lead?.interestedModel?.toLowerCase().includes(modelFilter.toLowerCase())
      )
    }

    // Sales consultant filter
    if (scFilter) {
      filtered = filtered.filter((deal: any) =>
        deal.lead?.assignedTo?.id === scFilter
      )
    }

    return filtered
  }, [dealsArray, startDate, endDate, modelFilter, scFilter])

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  const clearFilters = () => {
    setStartDate(undefined)
    setEndDate(undefined)
    setModelFilter('')
    setScFilter('')
    setGlobalFilter('')
    setColumnFilters([])
  }

  const activeFiltersCount = [startDate, endDate, modelFilter, scFilter].filter(Boolean).length

  // Export to CSV
  const handleExportCSV = () => {
    setIsExporting(true)
    try {
      const headers = ['Date Released', 'Customer Name', 'Email', 'Model', 'Chassis Number', 'VSI Number', 'Sale Price', 'Sales Consultant']
      const rows = filteredData.map((deal: any) => [
        format(new Date(deal.dateReleased), 'yyyy-MM-dd'),
        `${deal.lead?.firstName} ${deal.lead?.lastName}`,
        deal.lead?.email,
        deal.lead?.interestedModel,
        deal.chassisNumber,
        deal.vsiNumber,
        deal.salePrice,
        `${deal.lead?.assignedTo?.firstName} ${deal.lead?.assignedTo?.lastName}`,
      ])

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `closed-deals-${format(new Date(), 'yyyy-MM-dd')}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: 'Success!',
        description: 'Closed deals exported to CSV successfully.',
        variant: 'success',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export closed deals.',
        variant: 'destructive',
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Closed Deals</h1>
          <p className="text-muted-foreground mt-2">
            Track your successful deals and revenue
          </p>
        </div>
        <Button
          onClick={handleExportCSV}
          disabled={isExporting || filteredData.length === 0}
          className="gap-2 rounded-xl"
        >
          {isExporting ? (
            <>
              <FileSpreadsheet className="h-4 w-4 animate-pulse" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Export CSV
            </>
          )}
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Deals"
          value={filteredData.length}
          icon={Award}
          delay={0}
        />
        <StatCard
          title="Total Revenue"
          value={`₱${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          delay={0.1}
        />
        <StatCard
          title="Avg Deal Size"
          value={`₱${Math.round(avgDealSize).toLocaleString()}`}
          icon={TrendingUp}
          delay={0.2}
        />
        <StatCard
          title="This Month"
          value={thisMonthDeals}
          icon={CalendarIcon}
          delay={0.3}
        />
      </div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-4 glass-card">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by customer name, email, chassis, or VSI..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-10 rounded-xl glass-input"
              />
            </div>
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2 rounded-xl relative">
                  <Filter className="h-4 w-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                  <SheetTitle>Filter Closed Deals</SheetTitle>
                  <SheetDescription>
                    Refine your closed deals list with advanced filters
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {/* Date Range */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date Range</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              'justify-start text-left font-normal rounded-xl',
                              !startDate && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, 'PPP') : 'Start date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                          />
                        </PopoverContent>
                      </Popover>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              'justify-start text-left font-normal rounded-xl',
                              !endDate && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, 'PPP') : 'End date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Model Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Model</label>
                    <Input
                      placeholder="Filter by model..."
                      value={modelFilter}
                      onChange={(e) => setModelFilter(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>

                  {/* Sales Consultant Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sales Consultant</label>
                    <select
                      value={scFilter}
                      onChange={(e) => setScFilter(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                      <option value="">All Sales Consultants</option>
                      {salesConsultants.map((sc: any) => (
                        <option key={sc.id} value={sc.id}>
                          {sc.firstName} {sc.lastName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="flex-1 rounded-xl"
                    >
                      Clear All
                    </Button>
                    <Button
                      onClick={() => setIsFilterOpen(false)}
                      className="flex-1 rounded-xl"
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </Card>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="overflow-hidden glass-card">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Closed Deals Found</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                {activeFiltersCount > 0
                  ? 'Try adjusting your filters to see more results.'
                  : 'Closed deals will appear here once sales are completed.'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border/50">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground"
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.map((row, index) => (
                      <motion.tr
                        key={row.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-border/30 hover:bg-accent/50 transition-colors"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-6 py-4">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-border/50">
                <div className="text-sm text-muted-foreground">
                  Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                  {Math.min(
                    (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                    table.getFilteredRowModel().rows.length
                  )}{' '}
                  of {table.getFilteredRowModel().rows.length} deals
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="rounded-xl"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="rounded-xl"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
