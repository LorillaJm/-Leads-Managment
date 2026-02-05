import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Mail,
  Shield,
  Key,
  LogOut,
  Settings,
  Bell,
  Globe,
  Monitor,
  Sun,
  Moon,
  Laptop,
  HelpCircle,
  FileText,
  Users,
  Lock,
  Activity,
  Camera,
  X,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface UserProfilePanelProps {
  isOpen: boolean
  onClose: () => void
  user: {
    id: string
    fullName: string
    email: string
    role: string
    position?: string
    department?: string
    avatar?: string
    isOnline?: boolean
  }
  onLogout: () => void
}

type ThemeOption = 'light' | 'dark' | 'system'

export function UserProfilePanel({ isOpen, onClose, user, onLogout }: UserProfilePanelProps) {
  const [theme, setTheme] = useState<ThemeOption>('system')
  const [showPhotoMenu, setShowPhotoMenu] = useState(false)

  const isAdmin = user.role === 'ADMIN'

  const profileSections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Edit Profile', action: () => console.log('Edit Profile') },
        { icon: Key, label: 'Change Password', action: () => console.log('Change Password') },
        { icon: Shield, label: 'Two-Factor Authentication', action: () => console.log('2FA') },
        { icon: Activity, label: 'Login Sessions', action: () => console.log('Sessions') },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: Monitor, label: 'Theme', action: () => {}, hasSubmenu: true },
        { icon: Globe, label: 'Language', action: () => console.log('Language'), badge: 'English' },
        { icon: Settings, label: 'UI Density', action: () => console.log('Density'), badge: 'Comfortable' },
        { icon: Bell, label: 'Notifications', action: () => console.log('Notifications') },
      ],
    },
  ]

  const adminSection = {
    title: 'Administration',
    items: [
      { icon: Users, label: 'User Management', action: () => console.log('Users') },
      { icon: Lock, label: 'Roles & Permissions', action: () => console.log('Roles') },
      { icon: FileText, label: 'Audit Logs', action: () => console.log('Audit') },
      { icon: Settings, label: 'System Settings', action: () => console.log('System') },
    ],
  }

  const supportSection = {
    title: 'Support',
    items: [
      { icon: HelpCircle, label: 'Help & Support', action: () => console.log('Help') },
      { icon: FileText, label: 'Documentation', action: () => console.log('Docs') },
    ],
  }

  const themeOptions = [
    { value: 'light' as ThemeOption, label: 'Light', icon: Sun },
    { value: 'dark' as ThemeOption, label: 'Dark', icon: Moon },
    { value: 'system' as ThemeOption, label: 'System', icon: Laptop },
  ]

  const handleThemeChange = (newTheme: ThemeOption) => {
    setTheme(newTheme)
    // Implement theme change logic here
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-background border-l border-border shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex-shrink-0 px-6 py-5 border-b border-border/50 bg-muted/30">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Profile</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Profile Card */}
              <div className="relative">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="relative group">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-xl font-semibold text-primary border-2 border-primary/20">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.fullName}
                          className="w-full h-full rounded-2xl object-cover"
                        />
                      ) : (
                        getInitials(user.fullName)
                      )}
                    </div>
                    
                    {/* Online Status */}
                    {user.isOnline && (
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-background" />
                    )}

                    {/* Photo Change Overlay */}
                    <button
                      onClick={() => setShowPhotoMenu(!showPhotoMenu)}
                      className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <Camera className="w-5 h-5 text-white" />
                    </button>

                    {/* Photo Menu */}
                    <AnimatePresence>
                      {showPhotoMenu && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          className="absolute top-full left-0 mt-2 w-48 bg-background border border-border rounded-xl shadow-lg overflow-hidden z-10"
                        >
                          <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-muted transition-colors">
                            Upload Photo
                          </button>
                          <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-muted transition-colors">
                            Change Photo
                          </button>
                          <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-muted transition-colors text-destructive">
                            Remove Photo
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold truncate">{user.fullName}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {user.position || user.role}
                    </p>
                    {user.department && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {user.department}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-6 py-4 space-y-6">
                {/* Account Section */}
                {profileSections.map((section, sectionIndex) => (
                  <div key={sectionIndex}>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      {section.title}
                    </h4>
                    <div className="space-y-1">
                      {section.items.map((item, itemIndex) => {
                        const Icon = item.icon
                        
                        if (item.hasSubmenu && item.label === 'Theme') {
                          return (
                            <div key={itemIndex} className="space-y-2">
                              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/50 transition-colors">
                                <Icon className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm font-medium flex-1">Theme</span>
                              </div>
                              <div className="grid grid-cols-3 gap-2 pl-10">
                                {themeOptions.map((option) => {
                                  const ThemeIcon = option.icon
                                  return (
                                    <button
                                      key={option.value}
                                      onClick={() => handleThemeChange(option.value)}
                                      className={cn(
                                        'flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-lg border transition-all',
                                        theme === option.value
                                          ? 'border-primary bg-primary/5 text-primary'
                                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                                      )}
                                    >
                                      <ThemeIcon className="w-4 h-4" />
                                      <span className="text-xs font-medium">{option.label}</span>
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                          )
                        }

                        return (
                          <button
                            key={itemIndex}
                            onClick={item.action}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/50 transition-colors group"
                          >
                            <Icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                            <span className="text-sm font-medium flex-1 text-left">
                              {item.label}
                            </span>
                            {item.badge && (
                              <Badge variant="secondary" className="text-xs">
                                {item.badge}
                              </Badge>
                            )}
                            <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}

                {/* Admin Section */}
                {isAdmin && (
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      {adminSection.title}
                    </h4>
                    <div className="space-y-1">
                      {adminSection.items.map((item, index) => {
                        const Icon = item.icon
                        return (
                          <button
                            key={index}
                            onClick={item.action}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/50 transition-colors group"
                          >
                            <Icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                            <span className="text-sm font-medium flex-1 text-left">
                              {item.label}
                            </span>
                            <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Support Section */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    {supportSection.title}
                  </h4>
                  <div className="space-y-1">
                    {supportSection.items.map((item, index) => {
                      const Icon = item.icon
                      return (
                        <button
                          key={index}
                          onClick={item.action}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/50 transition-colors group"
                        >
                          <Icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                          <span className="text-sm font-medium flex-1 text-left">
                            {item.label}
                          </span>
                          <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer - Logout */}
            <div className="flex-shrink-0 px-6 py-4 border-t border-border/50 bg-muted/30">
              <Button
                onClick={onLogout}
                variant="ghost"
                className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Logout</span>
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
