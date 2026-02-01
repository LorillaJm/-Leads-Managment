import { useAuth } from '@/contexts/AuthContext'
import { LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="h-16 glass-card m-4 mb-0 rounded-b-none border-b-0 flex items-center justify-between px-6">
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search leads, deals..."
            className="w-full pl-4 pr-4 py-2 glass-input text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="font-medium text-zinc-900">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-zinc-500 capitalize">
              {user?.role.toLowerCase().replace('_', ' ')}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-zinc-600 hover:text-zinc-900"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}