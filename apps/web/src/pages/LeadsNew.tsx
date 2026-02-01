import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Plus, Filter, Search, ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { api } from '@/lib/api'
import { NewLeadSheet } from '@/components/leads/NewLeadSheet'

const statusColors: Record<string, 'default' | 'warning' | 'success' | 'destructive'> = {
  NEW: 'default',
  CONTACTED: 'warning',
  QUALIFIED: 'success',
  TEST_DRIVE: 'default',
  RESERVATION: 'warning',
  BANK_APPLICATION: 'warning',
  CLOSED_DEAL: 'success',
  LOST: 'destructive',
}

export function LeadsNew() {
  const navigate = useNavigate()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false)

  // Filter states
  const [modelFilter, setModelFilter] = useState('')
  const [colorFilter, setColorFilter] = useState('')
  const [sourceFilter, setSourceFilter] = useState('')
  const [interestFilter, setInterestFilter] = useState('')

  const { data: leadsResponse, isLoading, refetch } = useQuery({
    queryKey: ['leads'],
    queryFn: api.getLeads,
  })

  const leads = (leadsResponse as any)?.data?.leads || []

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'createdAt',
        header: ({ column }) => {
          return (
            <button
              className="flex items-center gap-2 hover:text-foreground transition-colors"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Date
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
            {format(new Date(row.original.createdAt), 'MMM dd, yyyy')}
          </div>
        ),
      },
      {
        accessorKey: 'name',
        header: ({ column }) => {
          return (
            <button
              className="flex items-center gap-2 hover:text-foreground transition-colors"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Name
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
          <div className="font-medium">
            {row.original.firstName} {row.original.lastName}
          </div>
        ),
      },
      {
        accessorKey: 'phone',
        header: 'Contact',
        cell: ({ row }) => (
          <div>
            <div className="text-sm">{row.original.phone}</div>
            <div className="text-xs text-muted-foreground">{row.original.email}</div>
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
          <div className="font-medium">{row.original.interestedModel}</div>
        ),
      },
      {
        accessorKey: 'preferredColor',
        header: 'Color',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div
              className="h-4 w-4 rounded-full border border-border"
              style={{
                backgroundColor: row.original.preferredColor.toLowerCase(),
              }}
            />
            <span className="text-sm capitalize">{row.original.preferredColor}</span>
          </div>
        ),
      },
      {
        accessorKey: 'source',
        header: ({ column }) => {
          return (
            <button
              className="flex items-center gap-2 hover:text-foreground transition-colors"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Source
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
          <Badge variant="default" className="capitalize">
            {row.original.source.replace('_', ' ')}
          </Badge>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <Badge variant={statusColors[row.original.status]}>
            {row.original.status.replace('_', ' ')}
          </Badge>
        ),
      },
    ],
    []
  )

  const table = useReactTable({
    data: leads,
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
    setModelFilter('')
    setColorFilter('')
    setSourceFilter('')
    setInterestFilter('')
    setGlobalFilter('')
    setColumnFilters([])
  }

  const activeFiltersCount = [modelFilter, colorFilter, sourceFilter, interestFilter].filter(Boolean).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Leads</h1>
          <p className="text-muted-foreground mt-2">
            Track and manage your automotive leads
          </p>
        </div>
        <Button 
          className="press-effect gap-2 rounded-xl"
          onClick={() => setIsNewLeadOpen(true)}
        >
          <Plus className="h-4 w-4" />
          New Lead
        </Button>
      </motion.div>

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
                placeholder="Search by name, contact, or email..."
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
                  <SheetTitle>Filter Leads</SheetTitle>
                  <SheetDescription>
                    Refine your lead list with advanced filters
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Model</label>
                    <Input
                      placeholder="Filter by model..."
                      value={modelFilter}
                      onChange={(e) => setModelFilter(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Color</label>
                    <Input
                      placeholder="Filter by color..."
                      value={colorFilter}
                      onChange={(e) => setColorFilter(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Source</label>
                    <Input
                      placeholder="Filter by source..."
                      value={sourceFilter}
                      onChange={(e) => setSourceFilter(e.target.value)}
                      className="rounded-xl"
                    />
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
          ) : table.getRowModel().rows.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No leads found"
              description="Get started by adding your first lead or adjust your search filters."
              action={{
                label: 'Add Lead',
                onClick: () => setIsNewLeadOpen(true),
              }}
            />
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
                        className="border-b border-border/30 hover:bg-accent/50 cursor-pointer transition-colors"
                        onClick={() => navigate(`/leads/${row.original.id}`)}
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
                  of {table.getFilteredRowModel().rows.length} leads
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

      {/* New Lead Sheet */}
      <NewLeadSheet
        open={isNewLeadOpen}
        onOpenChange={setIsNewLeadOpen}
        onSuccess={() => {
          refetch()
          setIsNewLeadOpen(false)
        }}
      />
    </div>
  )
}
