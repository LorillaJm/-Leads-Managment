import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Filter, Search, MoreHorizontal } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EmptyState } from '@/components/ui/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'

const statusColors = {
  new: 'default',
  contacted: 'warning',
  qualified: 'success',
  proposal: 'default',
  negotiation: 'warning',
} as const

export function Leads() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const { data: leads, isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: api.getLeads,
  })

  const leadsArray = (leads as any)?.data?.leads || []
  
  const filteredLeads = searchQuery 
    ? leadsArray.filter((lead: any) => {
        const query = searchQuery.toLowerCase()
        return (
          lead.companyName?.toLowerCase().includes(query) ||
          lead.contactName?.toLowerCase().includes(query) ||
          lead.email?.toLowerCase().includes(query)
        )
      })
    : leadsArray

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
            Manage and track your sales leads
          </p>
        </div>
        <Button className="press-effect gap-2">
          <Plus className="h-4 w-4" />
          Add Lead
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-0 overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : !filteredLeads || filteredLeads.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No leads found"
              description="Get started by adding your first lead or adjust your search filters."
              action={{
                label: 'Add Lead',
                onClick: () => {},
              }}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Last Contact</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead: any, index: number) => (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="cursor-pointer"
                    onClick={() => navigate(`/leads/${lead.id}`)}
                  >
                    <TableCell className="font-medium">
                      {lead.companyName}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{lead.contactName}</p>
                        <p className="text-xs text-muted-foreground">{lead.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusColors[lead.status as keyof typeof statusColors]}>
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      ${lead.estimatedValue?.toLocaleString() || 0}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(lead.lastContactDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation()
                        }}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
