import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';
import { Loader2 } from 'lucide-react';

const updateUserSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  position: z.string().min(1, 'Position is required'),
  role: z.enum(['ADMIN', 'SC']),
  photoUrl: z.string().url().optional().or(z.literal('')),
  status: z.enum(['ACTIVE', 'DISABLED']),
});

type UpdateUserForm = z.infer<typeof updateUserSchema>;

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
}

export function EditUserDialog({ open, onOpenChange, user }: EditUserDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateUserForm>({
    resolver: zodResolver(updateUserSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName,
        position: user.position || '',
        role: user.role,
        photoUrl: user.photoUrl || '',
        status: user.status,
      });
    }
  }, [user, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: UpdateUserForm) => api.updateUser(user.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: 'Success',
        description: 'User updated successfully',
      });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update user',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: UpdateUserForm) => {
    updateMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit User</DialogTitle>
          <DialogDescription>
            Update user information and permissions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="edit-fullName">Full Name *</Label>
            <Input
              id="edit-fullName"
              placeholder="John Doe"
              className="rounded-xl"
              {...register('fullName')}
            />
            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-position">Position *</Label>
            <Input
              id="edit-position"
              placeholder="Sales Consultant"
              className="rounded-xl"
              {...register('position')}
            />
            {errors.position && (
              <p className="text-sm text-red-500">{errors.position.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-role">Role *</Label>
            <select
              id="edit-role"
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-sm"
              {...register('role')}
            >
              <option value="SC">Sales Consultant</option>
              <option value="ADMIN">Admin</option>
            </select>
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-photoUrl">Photo URL (Optional)</Label>
            <Input
              id="edit-photoUrl"
              type="url"
              placeholder="https://example.com/photo.jpg"
              className="rounded-xl"
              {...register('photoUrl')}
            />
            {errors.photoUrl && (
              <p className="text-sm text-red-500">{errors.photoUrl.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-status">Status *</Label>
            <select
              id="edit-status"
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-white text-sm"
              {...register('status')}
            >
              <option value="ACTIVE">Active</option>
              <option value="DISABLED">Disabled</option>
            </select>
            {errors.status && (
              <p className="text-sm text-red-500">{errors.status.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 rounded-xl"
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 rounded-xl bg-zinc-900 hover:bg-zinc-800"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
