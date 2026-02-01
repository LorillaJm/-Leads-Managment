import { useState } from 'react';
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
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  fullName: z.string().min(1, 'Full name is required'),
  position: z.string().min(1, 'Position is required'),
  role: z.enum(['ADMIN', 'SC']),
  temporaryPassword: z.string().min(8, 'Password must be at least 8 characters'),
  photoUrl: z.string().url().optional().or(z.literal('')),
  forcePasswordChange: z.boolean().default(true),
});

type CreateUserForm = z.infer<typeof createUserSchema>;

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateUserDialog({ open, onOpenChange }: CreateUserDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      role: 'SC',
      forcePasswordChange: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateUserForm) => api.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: 'Success',
        description: 'User created successfully',
      });
      reset();
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create user',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: CreateUserForm) => {
    createMutation.mutate(data);
  };

  const generatePassword = () => {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-[540px] max-h-[90vh] overflow-y-auto rounded-2xl p-0">
        <div className="sticky top-0 z-10 bg-white border-b border-zinc-100 px-4 sm:px-6 py-4 rounded-t-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl">Create New User</DialogTitle>
            <DialogDescription className="text-sm">
              Add a new user account to the system. They will be required to change their password on first login.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-4 sm:px-6 py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@byd.com"
              className="rounded-xl h-10 text-sm"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium">Full Name *</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                className="rounded-xl h-10 text-sm"
                {...register('fullName')}
              />
              {errors.fullName && (
                <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="position" className="text-sm font-medium">Position *</Label>
              <Input
                id="position"
                placeholder="Sales Consultant"
                className="rounded-xl h-10 text-sm"
                {...register('position')}
              />
              {errors.position && (
                <p className="text-xs text-red-500 mt-1">{errors.position.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium">Role *</Label>
            <select
              id="role"
              className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              {...register('role')}
            >
              <option value="SC">Sales Consultant</option>
              <option value="ADMIN">Admin</option>
            </select>
            {errors.role && (
              <p className="text-xs text-red-500 mt-1">{errors.role.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="photoUrl" className="text-sm font-medium">Photo URL (Optional)</Label>
            <Input
              id="photoUrl"
              type="url"
              placeholder="https://example.com/photo.jpg"
              className="rounded-xl h-10 text-sm"
              {...register('photoUrl')}
            />
            {errors.photoUrl && (
              <p className="text-xs text-red-500 mt-1">{errors.photoUrl.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="temporaryPassword" className="text-sm font-medium">Temporary Password *</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  const password = generatePassword();
                  const event = { target: { value: password } };
                  register('temporaryPassword').onChange(event);
                }}
                className="text-xs h-7 px-2 rounded-lg hover:bg-zinc-100"
              >
                Generate
              </Button>
            </div>
            <div className="relative">
              <Input
                id="temporaryPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                className="rounded-xl h-10 pr-10 text-sm"
                {...register('temporaryPassword')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.temporaryPassword && (
              <p className="text-xs text-red-500 mt-1">{errors.temporaryPassword.message}</p>
            )}
          </div>

          <div className="flex items-start space-x-2 py-2">
            <input
              type="checkbox"
              id="forcePasswordChange"
              className="mt-0.5 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
              {...register('forcePasswordChange')}
              defaultChecked
            />
            <Label htmlFor="forcePasswordChange" className="text-sm font-normal cursor-pointer leading-tight">
              Force password change on first login
            </Label>
          </div>

          <div className="sticky bottom-0 bg-white border-t border-zinc-100 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 mt-6 flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:flex-1 rounded-xl h-10 text-sm"
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:flex-1 rounded-xl h-10 text-sm bg-zinc-900 hover:bg-zinc-800"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create User'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
