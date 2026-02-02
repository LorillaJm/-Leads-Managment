import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createLeadSchema, type CreateLeadInput, UserRole } from '@lead-management/shared';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LeadFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead?: any;
  onSuccess: () => void;
}

const carModels = ['BYD Atto 3', 'BYD Seal', 'BYD Dolphin', 'BYD Han', 'BYD Tang'];
const colors = ['White', 'Black', 'Silver', 'Blue', 'Red', 'Gray', 'Green'];
const sources = ['Website', 'Referral', 'Walk-in', 'Social Media', 'Phone Call', 'Email'];

export function LeadFormDialog({ open, onOpenChange, lead, onSuccess }: LeadFormDialogProps) {
  const { user } = useAuth();
  const isEditing = !!lead;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateLeadInput>({
    resolver: zodResolver(createLeadSchema),
    defaultValues: lead || {},
  });

  // Fetch sales consultants for assignment (Admin only)
  const { data: salesConsultantsData } = useQuery({
    queryKey: ['salesConsultants'],
    queryFn: async () => {
      const response: any = await apiClient.getSalesConsultants();
      return response.data.salesConsultants;
    },
    enabled: user?.role === UserRole.ADMIN,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateLeadInput) => apiClient.createLead(data),
    onSuccess: () => {
      reset();
      onSuccess();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: CreateLeadInput) => apiClient.updateLead(lead.id, data),
    onSuccess: () => {
      reset();
      onSuccess();
    },
  });

  useEffect(() => {
    if (lead) {
      reset(lead);
    } else {
      reset({});
    }
  }, [lead, reset]);

  const onSubmit = (data: CreateLeadInput) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const selectedModel = watch('interestedModel');
  const selectedColor = watch('preferredColor');
  const selectedSource = watch('source');
  const selectedAssignedTo = watch('assignedToId');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Lead' : 'Create New Lead'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-zinc-900">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  {...register('firstName')}
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm">{errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  {...register('lastName')}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="john.doe@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  {...register('phone')}
                  placeholder="+1234567890"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Vehicle Preferences */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-zinc-900">Vehicle Preferences</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="interestedModel">Interested Model *</Label>
                <Select
                  value={selectedModel}
                  onValueChange={(value) => setValue('interestedModel', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {carModels.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.interestedModel && (
                  <p className="text-red-500 text-sm">{errors.interestedModel.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredColor">Preferred Color *</Label>
                <Select
                  value={selectedColor}
                  onValueChange={(value) => setValue('preferredColor', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a color" />
                  </SelectTrigger>
                  <SelectContent>
                    {colors.map((color) => (
                      <SelectItem key={color} value={color}>
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.preferredColor && (
                  <p className="text-red-500 text-sm">{errors.preferredColor.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Lead Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-zinc-900">Lead Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source">Source *</Label>
                <Select
                  value={selectedSource}
                  onValueChange={(value) => setValue('source', value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a source" />
                  </SelectTrigger>
                  <SelectContent>
                    {sources.map((source) => (
                      <SelectItem key={source} value={source}>
                        {source}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.source && (
                  <p className="text-red-500 text-sm">{errors.source.message}</p>
                )}
              </div>

              {user?.role === UserRole.ADMIN && salesConsultantsData && (
                <div className="space-y-2">
                  <Label htmlFor="assignedToId">Assign To</Label>
                  <Select
                    value={selectedAssignedTo}
                    onValueChange={(value) => setValue('assignedToId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a consultant" />
                    </SelectTrigger>
                    <SelectContent>
                      {salesConsultantsData.map((consultant: any) => (
                        <SelectItem key={consultant.id} value={consultant.id}>
                          {consultant.firstName} {consultant.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? 'Saving...'
                : isEditing
                ? 'Update Lead'
                : 'Create Lead'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}