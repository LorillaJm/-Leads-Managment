import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import { ActivityType } from '@lead-management/shared'

// Base schema
const baseActivitySchema = z.object({
  type: z.enum(['TEST_DRIVE', 'RESERVATION', 'BANK_APPLICATION', 'CLOSED_DEAL'], {
    required_error: 'Activity type is required',
  }),
  scheduledDate: z.date().optional(),
  completedDate: z.date().optional(),
  notes: z.string().optional(),
})

// Conditional schemas
const bankApplicationSchema = baseActivitySchema.extend({
  type: z.literal('BANK_APPLICATION'),
  bankName: z.string().min(1, 'Bank name is required for bank applications'),
})

const closedDealSchema = baseActivitySchema.extend({
  type: z.literal('CLOSED_DEAL'),
  chassisNumber: z.string().min(1, 'Chassis number is required for closed deals'),
  vsiNumber: z.string().min(1, 'VSI number is required for closed deals'),
  dateReleased: z.date({
    required_error: 'Date released is required for closed deals',
  }),
})

// Union schema
const activitySchema = z.discriminatedUnion('type', [
  baseActivitySchema.extend({ type: z.literal('TEST_DRIVE') }),
  baseActivitySchema.extend({ type: z.literal('RESERVATION') }),
  bankApplicationSchema,
  closedDealSchema,
])

type ActivityFormData = z.infer<typeof activitySchema>

const activityTypes = [
  { value: 'TEST_DRIVE', label: 'Test Drive', description: 'Schedule or record a test drive' },
  { value: 'RESERVATION', label: 'Reservation', description: 'Customer reserved a vehicle' },
  { value: 'BANK_APPLICATION', label: 'Bank Application', description: 'Financing application submitted' },
  { value: 'CLOSED_DEAL', label: 'Closed Deal', description: 'Sale completed successfully' },
]

const banks = [
  'BDO',
  'BPI',
  'Metrobank',
  'Security Bank',
  'UnionBank',
  'RCBC',
  'PNB',
  'Chinabank',
  'EastWest Bank',
  'Other',
]

interface AddActivityModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  leadId: string
}

export function AddActivityModal({ open, onOpenChange, leadId }: AddActivityModalProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [_selectedType, setSelectedType] = useState<ActivityType | null>(null)

  const form = useForm<ActivityFormData>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      type: 'TEST_DRIVE',
      notes: '',
    },
  })

  const watchedType = form.watch('type')

  const createActivityMutation = useMutation({
    mutationFn: (data: any) => api.createActivity({ ...data, leadId }),
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'Activity has been added successfully.',
        variant: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['lead', leadId] })
      queryClient.invalidateQueries({ queryKey: ['activities', leadId] })
      form.reset()
      onOpenChange(false)
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add activity',
        variant: 'destructive',
      })
    },
  })

  const onSubmit = (data: ActivityFormData) => {
    // Convert dates to ISO strings
    const payload: any = {
      type: data.type,
      notes: data.notes || null,
      scheduledDate: data.scheduledDate?.toISOString() || null,
      completedDate: data.completedDate?.toISOString() || null,
    }

    // Add conditional fields
    if (data.type === 'BANK_APPLICATION' && 'bankName' in data) {
      payload.bankName = data.bankName
    }

    if (data.type === 'CLOSED_DEAL' && 'chassisNumber' in data) {
      payload.chassisNumber = data.chassisNumber
      payload.vsiNumber = data.vsiNumber
      payload.dateReleased = data.dateReleased.toISOString()
    }

    createActivityMutation.mutate(payload)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add Activity</DialogTitle>
          <DialogDescription>
            Track the lead's progress through the sales funnel.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
            {/* Activity Type Selection */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Type</FormLabel>
                  <div className="grid grid-cols-2 gap-3">
                    {activityTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => {
                          field.onChange(type.value)
                          setSelectedType(type.value as ActivityType)
                        }}
                        className={cn(
                          'p-4 rounded-xl border-2 transition-all text-left',
                          field.value === type.value
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50 hover:bg-accent'
                        )}
                      >
                        <p className="font-semibold text-sm">{type.label}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {type.description}
                        </p>
                      </button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date Fields */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="scheduledDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scheduled Date (Optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full justify-start text-left font-normal rounded-xl',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, 'PPP') : 'Pick a date'}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="completedDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Completed Date (Optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full justify-start text-left font-normal rounded-xl',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, 'PPP') : 'Pick a date'}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Conditional Fields for Bank Application */}
            {watchedType === 'BANK_APPLICATION' && (
              <FormField
                control={form.control}
                name="bankName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Name</FormLabel>
                    <div className="grid grid-cols-3 gap-2">
                      {banks.map((bank) => (
                        <button
                          key={bank}
                          type="button"
                          onClick={() => field.onChange(bank)}
                          className={cn(
                            'px-3 py-2 rounded-xl border-2 transition-all text-sm font-medium',
                            field.value === bank
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border hover:border-primary/50 hover:bg-accent'
                          )}
                        >
                          {bank}
                        </button>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Conditional Fields for Closed Deal */}
            {watchedType === 'CLOSED_DEAL' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="chassisNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chassis Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., MHFXW1234567890"
                            {...field}
                            className="rounded-xl font-mono"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vsiNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>VSI Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., VSI-2024-001"
                            {...field}
                            className="rounded-xl font-mono"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="dateReleased"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Released</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full justify-start text-left font-normal rounded-xl',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, 'PPP') : 'Pick a date'}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Date when the vehicle was released to the customer
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <textarea
                      placeholder="Add any additional notes about this activity..."
                      className="w-full min-h-[100px] px-3 py-2 rounded-xl border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createActivityMutation.isPending}
                className="flex-1 rounded-xl"
              >
                {createActivityMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Add Activity
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
