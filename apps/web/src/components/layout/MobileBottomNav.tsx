import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, CheckCircle2, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Leads', href: '/leads', icon: Users },
  { name: 'Deals', href: '/closed-deals', icon: CheckCircle2 },
  { name: 'Stats', href: '/performance', icon: TrendingUp },
]

export function MobileBottomNav() {
  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden glass-strong border-t border-separator"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === '/'}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 min-w-[4rem]',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <item.icon className="h-5 w-5" />
                  {isActive && (
                    <motion.div
                      layoutId="mobile-nav-indicator"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>
                <span className="text-xs font-medium">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </motion.nav>
  )
}
