import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { 
  LayoutDashboard, 
  Users, 
  CheckCircle2, 
  TrendingUp,
  Plus,
  Search
} from 'lucide-react'

const actions = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/', group: 'Navigate' },
  { name: 'Leads', icon: Users, href: '/leads', group: 'Navigate' },
  { name: 'Closed Deals', icon: CheckCircle2, href: '/closed-deals', group: 'Navigate' },
  { name: 'Performance', icon: TrendingUp, href: '/performance', group: 'Navigate' },
  { name: 'Create New Lead', icon: Plus, action: 'create-lead', group: 'Actions' },
  { name: 'Search Leads', icon: Search, action: 'search-leads', group: 'Actions' },
]

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const handleSelect = (item: typeof actions[0]) => {
    setOpen(false)
    if (item.href) {
      navigate(item.href)
    } else if (item.action === 'create-lead') {
      navigate('/leads?action=create')
    } else if (item.action === 'search-leads') {
      navigate('/leads')
    }
  }

  const groupedActions = actions.reduce((acc, action) => {
    if (!acc[action.group]) {
      acc[action.group] = []
    }
    acc[action.group].push(action)
    return acc
  }, {} as Record<string, typeof actions>)

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          />

          {/* Command Dialog */}
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-2xl elevation-lg"
            >
              <Command className="rounded-2xl">
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  {Object.entries(groupedActions).map(([group, items], index) => (
                    <div key={group}>
                      {index > 0 && <CommandSeparator />}
                      <CommandGroup heading={group}>
                        {items.map((item) => (
                          <CommandItem
                            key={item.name}
                            onSelect={() => handleSelect(item)}
                            className="cursor-pointer"
                          >
                            <item.icon className="mr-3 h-4 w-4" />
                            <span>{item.name}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </div>
                  ))}
                </CommandList>
              </Command>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
