# 🚀 Quick Start Guide

Get up and running with the Apple-inspired UI in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Basic knowledge of React and TypeScript

## Installation

```bash
# Navigate to the web app directory
cd apps/web

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Overview

```
apps/web/
├── src/
│   ├── components/
│   │   ├── layout/      # Sidebar, TopBar, Navigation
│   │   ├── ui/          # Reusable UI components
│   │   ├── leads/       # Lead-specific components
│   │   └── activities/  # Activity components
│   ├── pages/           # Page components
│   ├── contexts/        # React contexts
│   ├── lib/             # Utilities and API
│   └── index.css        # Design tokens
├── DESIGN_SYSTEM.md     # Complete design docs
├── IMPLEMENTATION_GUIDE.md
└── UI_SYSTEM_COMPLETE.md
```

## Creating Your First Page

### 1. Create a new page file

```tsx
// src/pages/MyPage.tsx
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function MyPage() {
  return (
    <div className="space-y-8">
      {/* Animated header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-semibold tracking-tight">
          My Page
        </h1>
        <p className="text-muted-foreground mt-2">
          Page description goes here
        </p>
      </motion.div>

      {/* Content card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Your content here</p>
            <Button className="mt-4">Action Button</Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
```

### 2. Add route to App.tsx

```tsx
import { MyPage } from './pages/MyPage'

// Inside the Routes component:
<Route path="/my-page" element={<MyPage />} />
```

### 3. Add navigation item

```tsx
// src/components/layout/Sidebar.tsx
const navigation = [
  // ... existing items
  { name: 'My Page', href: '/my-page', icon: YourIcon },
]
```

## Using UI Components

### Buttons

```tsx
import { Button } from '@/components/ui/button'

<Button variant="default">Primary</Button>
<Button variant="outline">Secondary</Button>
<Button variant="ghost">Tertiary</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
```

### Cards

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
</Card>
```

### Inputs

```tsx
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input 
    id="email" 
    type="email" 
    placeholder="you@example.com" 
  />
</div>
```

### Tables

```tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map((item) => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.status}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Badges

```tsx
import { Badge } from '@/components/ui/badge'

<Badge variant="default">Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="destructive">Error</Badge>
```

### Dialogs/Modals

```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>
        Dialog description
      </DialogDescription>
    </DialogHeader>
    <div>Dialog content</div>
  </DialogContent>
</Dialog>
```

## Adding Animations

### Page Entrance

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

### Staggered List

```tsx
{items.map((item, index) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05 }}
  >
    {item.content}
  </motion.div>
))}
```

### Hover Effect

```tsx
<motion.div
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
>
  Content
</motion.div>
```

## Styling Guidelines

### Use Tailwind Classes

```tsx
// ✅ Good
<div className="flex items-center gap-4 p-6 rounded-xl bg-card">

// ❌ Avoid inline styles
<div style={{ display: 'flex', padding: '24px' }}>
```

### Spacing

```tsx
// Use consistent spacing scale
<div className="space-y-4">  {/* 16px vertical spacing */}
<div className="space-y-6">  {/* 24px vertical spacing */}
<div className="space-y-8">  {/* 32px vertical spacing */}
```

### Responsive Design

```tsx
// Mobile-first approach
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
```

## Data Fetching

### Using React Query

```tsx
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export function MyComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['my-data'],
    queryFn: api.getMyData,
  })

  if (isLoading) return <Skeleton className="h-32 w-full" />
  if (error) return <div>Error loading data</div>

  return <div>{/* Render data */}</div>
}
```

### API Client

```tsx
// Available API methods
api.getLeads()
api.getLeadById(id)
api.createLead(data)
api.updateLead(id, data)
api.deleteLead(id)
api.getDashboardStats()
api.getClosedDeals()
api.getPerformanceStats()
```

## Common Patterns

### Loading State

```tsx
import { Skeleton } from '@/components/ui/skeleton'

{isLoading ? (
  <Skeleton className="h-16 w-full" />
) : (
  <DataComponent data={data} />
)}
```

### Empty State

```tsx
import { EmptyState } from '@/components/ui/empty-state'
import { Users } from 'lucide-react'

{data.length === 0 && (
  <EmptyState
    icon={Users}
    title="No items found"
    description="Get started by adding your first item."
    action={{
      label: "Add Item",
      onClick: handleAdd
    }}
  />
)}
```

### Stat Cards

```tsx
import { StatCard } from '@/components/ui/stat-card'
import { Users } from 'lucide-react'

<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
  <StatCard
    title="Total Users"
    value={1234}
    change={{ value: 12, trend: 'up' }}
    icon={Users}
    delay={0}
  />
</div>
```

## Keyboard Shortcuts

- `⌘K` / `Ctrl+K` - Open command palette
- `Tab` - Navigate between elements
- `Esc` - Close modals/drawers
- `Enter` - Submit forms

## Testing Responsive Design

### Browser DevTools
1. Open DevTools (F12)
2. Click device toolbar icon
3. Test at different breakpoints:
   - Mobile: 375px, 414px
   - Tablet: 768px, 1024px
   - Desktop: 1280px, 1920px

### Key Checks
- ✅ No horizontal scrolling
- ✅ Touch targets ≥44px on mobile
- ✅ Text is readable at all sizes
- ✅ Navigation works on all devices

## Troubleshooting

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Type check
npm run build
```

### Styling Issues

```bash
# Ensure Tailwind is processing correctly
# Check tailwind.config.js content paths
# Verify index.css is imported in main.tsx
```

### Animation Issues

```bash
# Ensure Framer Motion is installed
npm install framer-motion
```

## Next Steps

1. **Read the docs**
   - DESIGN_SYSTEM.md - Design principles
   - IMPLEMENTATION_GUIDE.md - Best practices
   - UI_SYSTEM_COMPLETE.md - Complete overview

2. **Explore components**
   - Check `/src/components/ui` for all components
   - Look at `/src/pages` for usage examples

3. **Customize**
   - Edit `src/index.css` for color changes
   - Modify `tailwind.config.js` for theme adjustments

4. **Build features**
   - Create new pages
   - Add custom components
   - Integrate with your API

## Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Radix UI Docs](https://www.radix-ui.com/)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [React Query Docs](https://tanstack.com/query/latest)

## Support

For questions or issues:
1. Check the documentation files
2. Review component source code
3. Test in different browsers
4. Validate responsive behavior

---

**Happy coding!** 🚀
