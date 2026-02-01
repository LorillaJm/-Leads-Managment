import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { createActivitySchema, type CreateActivityInput, ActivityType } from '@lead-management/shared';
import { apiClient } from '@/lib/api';
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

interface AddActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: string;
  onSuccess: () => void;
}

const activityTypes = [
  { value: ActivityType.TEST_DRIVE, label: 'Test Drive' },
  { value: ActivityType.RESERVATION, label: 'Reservation' },
  { value: ActivityType.BANK_APPLICATION, label: 'Bank Application' },
  { value: ActivityType.CLOSED_DEAL, label: 'Closed Deal' },
];

export function AddActivityDialog({ open, onOpenChange, leadId, onSuccess }: AddActivityDialogProps) {
  const [selectedType, setSelectedType] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateActivityInput>({
    resolver: zodResolver(createActivitySchema),
    defaultValues: {
      leadId,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateActivityInput) => apiClient.createActivity(data),
    onSuccess: () => {
      reset();
      setSelectedType('');
      onSuccess();
    },
  });

  const onSubmit = (data: CreateActivityInput) => {
    createMutation.mutate(data);
  };

  const activityType = watch('type');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Activity</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Activity Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Activity Type *</Label>
            <Select
              value={selectedType}
              onValueChange={(value) => {
                setSelectedType(value);
                setValue('type', value as ActivityType);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select activity type" />
              </SelectTrigger>
              <SelectContent>
                {activityTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-red-500 text-sm">{errors.type.message}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              {...register('notes')}
              placeholder="Add any additional notes..."
              className="w-full glass-input px-3 py-2 text-sm min-h-[100px] resize-none"
            />
            {errors.notes && (
              <p className="text-red-500 text-sm">{errors.notes.message}</p>
            )}
          </div>

          {/* Scheduled Date (for Test Drive) */}
          {activityType === ActivityType.TEST_DRIVE && (
            <div className="space-y-2">
              <Label htmlFor="scheduledDate">Scheduled Date & Time</Label>
              <Input
                id="scheduledDate"
                type="datetime-local"
                {...register('scheduledDate')}
              />
              {errors.scheduledDate && (
                <p className="text-red-500 text-sm">{errors.scheduledDate.message}</p>
              )}
            </div>
          )}

          {/* Bank Name (for Bank Application) */}
          {activityType === ActivityType.BANK_APPLICATION && (
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name *</Label>
              <Input
                id="bankName"
                {...register('bankName')}
                placeholder="Enter bank name"
              />
              {errors.bankName && (
                <p className="text-red-500 text-sm">{errors.bankName.message}</p>
              )}
            </div>
          )}

          {/* Closed Deal Fields */}
          {activityType === ActivityType.CLOSED_DEAL && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="chassisNumber">Chassis Number *</Label>
                  <Input
                    id="chassisNumber"
                    {...register('chassisNumber')}
                    placeholder="Enter chassis number"
                  />
                  {errors.chassisNumber && (
                    <p className="text-red-500 text-sm">{errors.chassisNumber.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vsiNumber">VSI Number *</Label>
                  <Input
                    id="vsiNumber"
                    {...register('vsiNumber')}
                    placeholder="Enter VSI number"
                  />
                  {errors.vsiNumber && (
                    <p className="text-red-500 text-sm">{errors.vsiNumber.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateReleased">Date Released *</Label>
                <Input
                  id="dateReleased"
                  type="date"
                  {...register('dateReleased')}
                />
                {errors.dateReleased && (
                  <p className="text-red-500 text-sm">{errors.dateReleased.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Completed Date */}
          <div className="space-y-2">
            <Label htmlFor="completedDate">Completed Date</Label>
            <Input
              id="completedDate"
              type="datetime-local"
              {...register('completedDate')}
              defaultValue={new Date().toISOString().slice(0, 16)}
            />
            {errors.completedDate && (
              <p className="text-red-500 text-sm">{errors.completedDate.message}</p>
            )}
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
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Adding...' : 'Add Activity'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}