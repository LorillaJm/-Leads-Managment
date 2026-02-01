import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, MoreHorizontal, UserPlus, Shield, Ban, CheckCircle, Key, Edit } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { Select } from '@/components/ui/select';
import { api } from '@/lib/api';
import { CreateUserDialog } from '@/components/users/CreateUserDialog';
import { EditUserDialog } from '@/components/users/EditUserDialog';
import { ResetPasswordDialog } from '@/components/users/ResetPasswordDialog';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

const roleColors = {
  ADMIN: 'destructive',
  SC: 'default',
} as const;

const statusColors = {
  ACTIVE: 'success',
  DISABLED: 'secondary',
} as const;

export function Users() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['users', { search: searchQuery, role: roleFilter, status: statusFilter, page, pageSize: 10 }],
    queryFn: () => {
      const params: any = { page, pageSize: 10 };
      if (searchQuery) params.search = searchQuery;
      if (roleFilter) params.role = roleFilter;
      if (statusFilter) params.status = statusFilter;
      return api.getUsers(params);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      api.updateUserStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: 'Success',
        description: 'User status updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update user status',
        variant: 'destructive',
      });
    },
  });

  const users = (data as any)?.data?.users || [];
  const pagination = (data as any)?.data?.pagination || { page: 1, totalPages: 1, total: 0 };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleResetPassword = (user: any) => {
    setSelectedUser(user);
    setResetPasswordDialogOpen(true);
  };

  const handleToggleStatus = (user: any) => {
    const newStatus = user.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    updateStatusMutation.mutate({ id: user.id, status: newStatus });
  };

  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">User Management</h1>
          <p className="text-zinc-500 mt-2">
            Manage user accounts and permissions
          </p>
        </div>
        <Button 
          onClick={() => setCreateDialogOpen(true)}
          className="gap-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white"
        >
          <UserPlus className="h-4 w-4" />
          Create User
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-4 bg-white/70 backdrop-blur-xl border-zinc-200/60 rounded-2xl shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input
                placeholder="Search by name, email, or position..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl border-zinc-200"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-zinc-200 bg-white text-sm"
              >
                <option value="">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="SC">Sales Consultant</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-zinc-200 bg-white text-sm"
              >
                <option value="">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="DISABLED">Disabled</option>
              </select>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-0 overflow-hidden bg-white/70 backdrop-blur-xl border-zinc-200/60 rounded-2xl shadow-sm">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : !users || users.length === 0 ? (
            <EmptyState
              icon={UserPlus}
              title="No users found"
              description="Get started by creating your first user account."
              action={{
                label: 'Create User',
                onClick: () => setCreateDialogOpen(true),
              }}
            />
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-zinc-200">
                      <TableHead>User</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user: any, index: number) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group border-zinc-100"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {user.photoUrl ? (
                              <img 
                                src={user.photoUrl} 
                                alt={user.fullName}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center text-sm font-medium text-zinc-600">
                                {getInitials(user.fullName)}
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-sm">{user.fullName}</p>
                              <p className="text-xs text-zinc-500">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-zinc-600">
                          {user.position || '-'}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={roleColors[user.role as keyof typeof roleColors]}
                            className="rounded-lg"
                          >
                            {user.role === 'ADMIN' ? (
                              <><Shield className="h-3 w-3 mr-1" /> Admin</>
                            ) : (
                              'Sales Consultant'
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={statusColors[user.status as keyof typeof statusColors]}
                            className="rounded-lg"
                          >
                            {user.status === 'ACTIVE' ? (
                              <><CheckCircle className="h-3 w-3 mr-1" /> Active</>
                            ) : (
                              <><Ban className="h-3 w-3 mr-1" /> Disabled</>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-zinc-500">
                          {user.lastLoginAt 
                            ? format(new Date(user.lastLoginAt), 'MMM d, yyyy')
                            : 'Never'}
                        </TableCell>
                        <TableCell className="text-sm text-zinc-500">
                          {format(new Date(user.createdAt), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-xl">
                              <DropdownMenuItem 
                                onClick={() => handleEditUser(user)}
                                className="rounded-lg"
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleResetPassword(user)}
                                className="rounded-lg"
                              >
                                <Key className="h-4 w-4 mr-2" />
                                Reset Password
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleToggleStatus(user)}
                                className="rounded-lg"
                              >
                                {user.status === 'ACTIVE' ? (
                                  <>
                                    <Ban className="h-4 w-4 mr-2" />
                                    Disable User
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Enable User
                                  </>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-200">
                  <p className="text-sm text-zinc-500">
                    Showing {users.length} of {pagination.total} users
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="rounded-lg"
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                      disabled={page === pagination.totalPages}
                      className="rounded-lg"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
      </motion.div>

      {/* Dialogs */}
      <CreateUserDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen} 
      />
      {selectedUser && (
        <>
          <EditUserDialog 
            open={editDialogOpen} 
            onOpenChange={setEditDialogOpen}
            user={selectedUser}
          />
          <ResetPasswordDialog 
            open={resetPasswordDialogOpen} 
            onOpenChange={setResetPasswordDialogOpen}
            user={selectedUser}
          />
        </>
      )}
    </div>
  );
}
