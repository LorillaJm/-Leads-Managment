import { motion } from 'framer-motion'
import { Search, Bell, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

interface TopBarProps {
  onMenuClick?: () => void
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const [searchFocused, setSearchFocused] = useState(false)

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 glass-strong border-b border-separator"
    >
      <div className="flex h-16 items-center gap-4 px-6 lg:px-8">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className={cn(
              "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors",
              searchFocused ? "text-primary" : "text-muted-foreground"
            )} />
            <Input
              type="search"
              placeholder="Search leads, deals, or press ⌘K"
              className="pl-10 h-10 bg-muted/30 border-transparent focus-visible:bg-background"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
          </Button>
        </div>
      </div>
    </motion.header>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
