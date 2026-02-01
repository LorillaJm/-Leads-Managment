import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'

const leadSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  interestedModel: z.string().min(1, 'Model is required'),
  preferredColor: z.string().min(1, 'Color is required'),
  source: z.enum(['WALK_IN', 'REFERRAL', 'SOCIAL_MEDIA', 'DISPLAY'], {
    required_error: 'Source is required',
  }),
  remarks: z.string().optional(),
})

type LeadFormData = z.infer<typeof leadSchema>

const carModels = [
  'Wigo',
  'Vios',
  'Yaris',
  'Corolla Altis',
  'Camry',
  'RAV4',
  'Fortuner',
  'Hilux',
  'Land Cruiser',
  'Alphard',
  'Hiace',
]

const carColors = [
  { name: 'White', value: 'white' },
  { name: 'Black', value: 'black' },
  { name: 'Silver', value: 'silver' },
  { name: 'Gray', value: 'gray' },
  { name: 'Red', value: 'red' },
  { name: 'Blue', value: 'blue' },
  { name: 'Pearl', value: 'pearl' },
]

const sources = [
  { label: 'Walk-in', value: 'WALK_IN' },
  { label: 'Referral', value: 'REFERRAL' },
  { label: 'Social Media', value: 'SOCIAL_MEDIA' },
  { label: 'Display', value: 'DISPLAY' },
]

interface NewLeadSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function NewLeadSheet({ open, onOpenChange, onSuccess }: NewLeadSheetProps) {
  const { toast } = useToast()
  const [dateInputted, setDateInputted] = useState<Date>(new Date())

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      interestedModel: '',
      preferredColor: '',
      source: 'WALK_IN',
      remarks: '',
    },
  })

  const { data: usersResponse } = useQuery({
    queryKey: ['sales-consultants'],
    queryFn: api.getSalesConsultants,
  })

  const salesConsultants = (usersResponse as any)?.data?.users || []

  const createLeadMutation = useMutation({
    mutationFn: api.createLead,
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'Lead has been created successfully.',
        variant: 'success',
      })
      form.reset()
      onSuccess()
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create lead',
        variant: 'destructive',
      })
    },
  })

  const onSubmit = (data: LeadFormData) => {
    // Get first sales consultant as default assignee
    const assignedToId = salesConsultants[0]?.id
    
    if (!assignedToId) {
      toast({
        title: 'Error',
        description: 'No sales consultant available',
        variant: 'destructive',
      })
      return
    }

    createLeadMutation.mutate({
      ...data,
      assignedToId,
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl">New Lead</SheetTitle>
          <SheetDescription>
            Add a new lead to your pipeline. Fill in all required information.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
            {/* Date Inputted */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Inputted</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal rounded-xl',
                      !dateInputted && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateInputted ? format(dateInputted, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateInputted}
                    onSelect={(date) => date && setDateInputted(date)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contact Fields */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+63 912 345 6789" {...field} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" type="email" {...field} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Model Selection */}
            <FormField
              control={form.control}
              name="interestedModel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interested Model</FormLabel>
                  <div className="grid grid-cols-3 gap-2">
                    {carModels.map((model) => (
                      <button
                        key={model}
                        type="button"
                        onClick={() => field.onChange(model)}
                        className={cn(
                          'px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium',
                          field.value === model
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50 hover:bg-accent'
                        )}
                      >
                        {model}
                      </button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Color Selection */}
            <FormField
              control={form.control}
              name="preferredColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Color</FormLabel>
                  <div className="grid grid-cols-4 gap-2">
                    {carColors.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => field.onChange(color.value)}
                        className={cn(
                          'px-4 py-3 rounded-xl border-2 transition-all flex items-center gap-2',
                          field.value === color.value
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50 hover:bg-accent'
                        )}
                      >
                        <div
                          className="h-4 w-4 rounded-full border border-border"
                          style={{ backgroundColor: color.value }}
                        />
                        <span className="text-sm font-medium">{color.name}</span>
                      </button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Source Selection */}
            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {sources.map((source) => (
                      <button
                        key={source.value}
                        type="button"
                        onClick={() => field.onChange(source.value)}
                        className={cn(
                          'px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium',
                          field.value === source.value
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50 hover:bg-accent'
                        )}
                      >
                        {source.label}
                      </button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Remarks */}
            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarks (Optional)</FormLabel>
                  <FormControl>
                    <textarea
                      placeholder="Add any additional notes..."
                      className="w-full min-h-[100px] px-3 py-2 rounded-xl border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
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
                disabled={createLeadMutation.isPending}
                className="flex-1 rounded-xl"
              >
                {createLeadMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Lead
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
