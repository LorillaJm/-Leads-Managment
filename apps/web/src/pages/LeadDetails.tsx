import { useState } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Car,
  Calendar,
  MapPin,
  Edit,
  User,
  Plus,
  Activity as ActivityIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import { EditLeadSheet } from '@/components/leads/EditLeadSheet'
import { ActivityTimeline } from '@/components/activities/ActivityTimeline'
import { AddActivityModal } from '@/components/activities/AddActivityModal'

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

export function LeadDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false)

  const { data: lead, isLoading, refetch } = useQuery({
    queryKey: ['lead', id],
    queryFn: () => api.getLeadById(id!),
  })

  const { data: activitiesResponse } = useQuery({
    queryKey: ['activities', id],
    queryFn: () => api.getActivitiesByLeadId(id!),
    enabled: !!id,
  })

  const leadData = (lead as any)?.data?.lead || null
  const activities = (activitiesResponse as any)?.data?.activities || []

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-96 lg:col-span-2" />
          <Skeleton className="h-96" />
        </div>
      </div>
    )
  }

  if (!leadData) {
    return <div>Lead not found</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/leads')}
            className="press-effect rounded-xl"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">
              {leadData.firstName} {leadData.lastName}
            </h1>
            <p className="text-muted-foreground mt-1">{leadData.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2 rounded-xl"
            onClick={() => setIsEditOpen(true)}
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </div>
      </motion.div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Lead Summary Card */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Lead Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Mail className="h-4 w-4" />
                    Email
                  </div>
                  <p className="font-medium">{leadData.email}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Phone className="h-4 w-4" />
                    Phone
                  </div>
                  <p className="font-medium">{leadData.phone || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Car className="h-4 w-4" />
                    Interested Model
                  </div>
                  <p className="font-medium">{leadData.interestedModel}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <div className="h-4 w-4 rounded-full border border-border" style={{ backgroundColor: leadData.preferredColor }} />
                    Preferred Color
                  </div>
                  <p className="font-medium capitalize">{leadData.preferredColor}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <MapPin className="h-4 w-4" />
                    Source
                  </div>
                  <Badge variant="default" className="capitalize">
                    {leadData.source.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <User className="h-4 w-4" />
                    Assigned To
                  </div>
                  <p className="font-medium">
                    {leadData.assignedTo?.firstName} {leadData.assignedTo?.lastName}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-separator">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                  <Calendar className="h-4 w-4" />
                  Status & Timeline
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={statusColors[leadData.status]}>
                    {leadData.status.replace('_', ' ')}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Created {format(new Date(leadData.createdAt), 'PPP')}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Last updated: {format(new Date(leadData.updatedAt), 'PPP p')}
                </p>
              </div>

              {leadData.remarks && (
                <div className="pt-4 border-t border-separator">
                  <h4 className="text-sm font-medium mb-2">Remarks</h4>
                  <p className="text-sm text-muted-foreground">{leadData.remarks}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Timeline Card */}
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ActivityIcon className="h-5 w-5" />
                  <CardTitle>Activity Timeline</CardTitle>
                </div>
                <Button
                  onClick={() => setIsAddActivityOpen(true)}
                  className="gap-2 rounded-xl"
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                  Add Activity
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ActivityTimeline activities={activities} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start gap-2 rounded-xl" variant="outline">
                <Mail className="h-4 w-4" />
                Send Email
              </Button>
              <Button className="w-full justify-start gap-2 rounded-xl" variant="outline">
                <Phone className="h-4 w-4" />
                Make Call
              </Button>
              <Button className="w-full justify-start gap-2 rounded-xl" variant="outline">
                <Calendar className="h-4 w-4" />
                Schedule Follow-up
              </Button>
            </CardContent>
          </Card>

          {/* Conversion Progress */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Conversion Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['Test Drive', 'Reservation', 'Bank Application', 'Closed Deal'].map((step, index) => {
                  const hasActivity = activities.some((a: any) => {
                    const stepMap: Record<string, string> = {
                      'Test Drive': 'TEST_DRIVE',
                      'Reservation': 'RESERVATION',
                      'Bank Application': 'BANK_APPLICATION',
                      'Closed Deal': 'CLOSED_DEAL',
                    }
                    return a.type === stepMap[step]
                  })

                  return (
                    <div key={step} className="flex items-center gap-3">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                          hasActivity
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${hasActivity ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {step}
                        </p>
                      </div>
                      {hasActivity && (
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Edit Lead Sheet */}
      <EditLeadSheet
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        lead={leadData}
        onSuccess={() => {
          refetch()
          setIsEditOpen(false)
        }}
      />

      {/* Add Activity Modal */}
      <AddActivityModal
        open={isAddActivityOpen}
        onOpenChange={setIsAddActivityOpen}
        leadId={id!}
      />
    </div>
  )
}
