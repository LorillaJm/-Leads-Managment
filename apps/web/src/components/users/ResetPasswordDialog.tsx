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
import { Eye, EyeOff, Loader2, Copy, Check } from 'lucide-react';

const resetPasswordSchema = z.object({
  temporaryPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
}

export function ResetPasswordDialog({ open, onOpenChange, user }: ResetPasswordDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const password = watch('temporaryPassword');

  const resetMutation = useMutation({
    mutationFn: (data: ResetPasswordForm) => 
      api.resetUserPassword(user.id, data.temporaryPassword),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: 'Success',
        description: 'Password reset successfully. User will be required to change it on next login.',
      });
      reset();
      setGeneratedPassword('');
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to reset password',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: ResetPasswordForm) => {
    resetMutation.mutate(data);
  };

  const generatePassword = () => {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setValue('temporaryPassword', password);
    setGeneratedPassword(password);
    setShowPassword(true);
  };

  const copyToClipboard = async () => {
    if (password) {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      toast({
        title: 'Copied',
        description: 'Password copied to clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Reset Password</DialogTitle>
          <DialogDescription>
            Set a new temporary password for <strong>{user?.fullName}</strong>. 
            They will be required to change it on next login.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="temporaryPassword">New Temporary Password *</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={generatePassword}
                className="text-xs rounded-lg"
              >
                Generate Secure
              </Button>
            </div>
            <div className="relative">
              <Input
                id="temporaryPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                className="rounded-xl pr-20"
                {...register('temporaryPassword')}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                {password && (
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="p-1.5 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-100"
                  >
                    {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-100"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {errors.temporaryPassword && (
              <p className="text-sm text-red-500">{errors.temporaryPassword.message}</p>
            )}
            <p className="text-xs text-zinc-500">
              Make sure to share this password securely with the user.
            </p>
          </div>

          {generatedPassword && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-xs text-amber-800 font-medium mb-1">⚠️ Important</p>
              <p className="text-xs text-amber-700">
                Copy this password now. You won't be able to see it again after closing this dialog.
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setGeneratedPassword('');
                onOpenChange(false);
              }}
              className="flex-1 rounded-xl"
              disabled={resetMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 rounded-xl bg-zinc-900 hover:bg-zinc-800"
              disabled={resetMutation.isPending}
            >
              {resetMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
