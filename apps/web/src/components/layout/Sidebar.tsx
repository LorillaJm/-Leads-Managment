import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  CheckCircle2, 
  TrendingUp,
  Trophy,
  Command,
  UserCog
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, adminOnly: false },
  { name: 'Leads', href: '/leads', icon: Users, adminOnly: false },
  { name: 'Closed Deals', href: '/closed-deals', icon: CheckCircle2, adminOnly: false },
  { name: 'Performance', href: '/performance', icon: TrendingUp, adminOnly: false },
  { name: 'Leaderboard', href: '/leaderboard', icon: Trophy, adminOnly: false },
  { name: 'Users', href: '/users', icon: UserCog, adminOnly: true },
]

export function Sidebar() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  const visibleNavigation = navigation.filter(item => !item.adminOnly || isAdmin)

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col"
    >
      <div className="flex grow flex-col gap-y-5 overflow-y-auto glass-strong border-r border-separator px-6 py-8">
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center elevation-sm">
            <Command className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">LeadFlow</h1>
            <p className="text-xs text-muted-foreground">Lead Management</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-y-2">
          <ul role="list" className="flex flex-1 flex-col gap-y-1">
            {visibleNavigation.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  end={item.href === '/'}
                  className={({ isActive }) =>
                    cn(
                      'group flex gap-x-3 rounded-xl px-4 py-3 text-sm font-medium leading-6 transition-all duration-200',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground/70 hover:text-foreground hover:bg-muted/50'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        className={cn(
                          'h-5 w-5 shrink-0 transition-colors',
                          isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                        )}
                      />
                      {item.name}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom section */}
        <div className="mt-auto pt-4 border-t border-separator">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
              {user?.fullName?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.fullName || 'User'}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.position || user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.aside>
  )
}
