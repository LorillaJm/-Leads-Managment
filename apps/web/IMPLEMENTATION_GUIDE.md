# Apple-Inspired UI Implementation Guide

## Quick Start

The design system is now fully implemented and ready to use. All components follow Apple's design principles with smooth animations, glass morphism effects, and responsive behavior.

## What's Been Implemented

### 1. Design Foundation
- ✅ Apple-inspired color system with soft backgrounds
- ✅ Custom CSS variables for theming
- ✅ Glass morphism utilities
- ✅ Elevation system (subtle shadows)
- ✅ Custom scrollbar styling
- ✅ Apple system font stack

### 2. Core UI Components

#### Buttons (`/components/ui/button.tsx`)
```tsx
import { Button } from '@/components/ui/button'

<Button variant="default">Primary</Button>
<Button variant="outline">Secondary</Button>
<Button variant="ghost">Tertiary</Button>
```

#### Cards (`/components/ui/card.tsx`)
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

#### Tables (`/components/ui/table.tsx`)
- Sticky headers with blur effect
- Subtle row separators
- Hover states
- Hidden action buttons (show on row hover)

#### Inputs (`/components/ui/input.tsx`)
- Rounded, tactile design
- Smooth focus transitions
- Hover effects

#### Other Components
- Badge (status indicators)
- Skeleton (loading states)
- Dialog (modals)
- Select (dropdowns)
- Drawer (slide-over panels)
- Empty State (no data views)
- Stat Card (dashboard metrics)
- Command Palette (⌘K search)

### 3. Layout System

#### Desktop Layout
- Fixed sidebar (288px)
- Glass morphism navigation
- Top bar with search
- Main content area

#### Mobile Layout
- Bottom navigation (iOS-style)
- Drawer-based sidebar
- Touch-optimized spacing
- Full-width cards

#### Components
- `Sidebar.tsx` - Desktop navigation
- `TopBar.tsx` - Header with search
- `MobileNav.tsx` - Mobile drawer
- `MobileBottomNav.tsx` - iOS-style bottom nav
- `CommandPalette.tsx` - Global search (⌘K)

### 4. Pages Implemented

All pages follow the Apple design system:

#### Dashboard (`/pages/Dashboard.tsx`)
- Stat cards with animations
- Staggered entrance effects
- Chart placeholders
- Activity feed

#### Leads (`/pages/Leads.tsx`)
- Advanced table with filters
- Search functionality
- Empty states
- Row animations
- Hidden action buttons

#### Lead Details (`/pages/LeadDetails.tsx`)
- Two-column layout
- Info cards
- Activity timeline
- Quick actions sidebar
- Circular progress indicator

#### Closed Deals (`/pages/ClosedDeals.tsx`)
- Revenue metrics
- Deal table
- Status badges

#### Performance (`/pages/Performance.tsx`)
- Performance metrics
- Chart placeholders
- Team leaderboard

#### Login (`/pages/Login.tsx`)
- Centered card layout
- Animated background
- Glass morphism
- Smooth transitions

## Responsive Breakpoints

```css
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

### Mobile (<768px)
- Bottom navigation visible
- Sidebar hidden (drawer on demand)
- Full-width cards
- Stacked layouts
- Large touch targets (44px min)

### Tablet (768px - 1023px)
- Collapsible sidebar
- Touch-friendly spacing
- 2-column grids

### Desktop (≥1024px)
- Fixed sidebar visible
- Bottom nav hidden
- Multi-column layouts
- Hover effects active

## Key Features

### 1. Command Palette
Press `⌘K` (Mac) or `Ctrl+K` (Windows) to open:
- Quick navigation
- Search functionality
- Action shortcuts

### 2. Animations
All animations use Framer Motion:
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

### 3. Glass Morphism
```tsx
<div className="glass">
  {/* Translucent with blur */}
</div>

<div className="glass-strong">
  {/* Stronger blur effect */}
</div>
```

### 4. Press Effects
```tsx
<Button className="press-effect">
  {/* Scales down on click */}
</Button>
```

### 5. Elevation
```tsx
<div className="elevation-sm">Small shadow</div>
<div className="elevation-md">Medium shadow</div>
<div className="elevation-lg">Large shadow</div>
```

## Customization

### Colors
Edit `apps/web/src/index.css`:
```css
:root {
  --primary: 213 94% 55%; /* Change accent color */
  --background: 0 0% 98%; /* Change background */
  /* ... other variables */
}
```

### Spacing
Edit `apps/web/tailwind.config.js`:
```js
extend: {
  spacing: {
    '18': '4.5rem',
    // Add custom spacing
  }
}
```

### Animations
Edit `apps/web/tailwind.config.js`:
```js
extend: {
  keyframes: {
    'custom-animation': {
      // Define animation
    }
  }
}
```

## Best Practices

### 1. Component Usage
```tsx
// ✅ Good - Consistent spacing
<div className="space-y-6">
  <Card>...</Card>
  <Card>...</Card>
</div>

// ❌ Avoid - Inconsistent spacing
<div>
  <Card className="mb-4">...</Card>
  <Card className="mt-8">...</Card>
</div>
```

### 2. Animations
```tsx
// ✅ Good - Staggered animations
{items.map((item, index) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
  >
    {item.content}
  </motion.div>
))}

// ❌ Avoid - All animate at once
{items.map((item) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    {item.content}
  </motion.div>
))}
```

### 3. Responsive Design
```tsx
// ✅ Good - Mobile-first approach
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Cards */}
</div>

// ❌ Avoid - Desktop-first
<div className="grid grid-cols-4 md:grid-cols-2 sm:grid-cols-1">
  {/* Cards */}
</div>
```

### 4. Loading States
```tsx
// ✅ Good - Skeleton loaders
{isLoading ? (
  <Skeleton className="h-16 w-full" />
) : (
  <DataTable data={data} />
)}

// ❌ Avoid - Generic spinner
{isLoading ? <Spinner /> : <DataTable data={data} />}
```

## Testing Responsive Design

### Desktop (≥1024px)
1. Sidebar should be visible and fixed
2. Bottom navigation should be hidden
3. Cards should use multi-column layouts
4. Hover effects should work

### Tablet (768px - 1023px)
1. Sidebar should be collapsible
2. Touch targets should be larger
3. 2-column layouts for cards

### Mobile (<768px)
1. Bottom navigation should be visible
2. Sidebar should be hidden (drawer on menu click)
3. Cards should be full-width
4. No horizontal scrolling
5. Touch targets minimum 44px

## Performance Tips

1. **Lazy Load**: Use React.lazy() for heavy components
2. **Debounce**: Debounce search inputs
3. **Virtual Scrolling**: For long lists (>100 items)
4. **Optimize Images**: Use WebP format, lazy loading
5. **Code Splitting**: Split by route

## Accessibility Checklist

- [x] Keyboard navigation works
- [x] Focus indicators are visible
- [x] Color contrast meets WCAG AA
- [x] ARIA labels on interactive elements
- [x] Semantic HTML structure
- [x] Screen reader friendly

## Next Steps

### Immediate
1. Test on real devices (iOS, Android)
2. Add dark mode support
3. Integrate real API data
4. Add form validation

### Short-term
1. Implement charts with Recharts
2. Add advanced filters
3. Create inline editing
4. Add drag-and-drop

### Long-term
1. Real-time notifications
2. Customizable dashboards
3. Export functionality
4. Bulk actions
5. Advanced search

## Troubleshooting

### Issue: Animations not working
**Solution**: Ensure Framer Motion is installed:
```bash
npm install framer-motion
```

### Issue: Glass effect not visible
**Solution**: Check browser support for backdrop-filter. Add fallback:
```css
@supports not (backdrop-filter: blur(20px)) {
  .glass {
    background: hsl(var(--card));
  }
}
```

### Issue: Mobile nav not showing
**Solution**: Check viewport meta tag in index.html:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

### Issue: Tailwind classes not working
**Solution**: Ensure tailwindcss-animate is installed:
```bash
npm install tailwindcss-animate
```

## Support

For questions or issues:
1. Check DESIGN_SYSTEM.md for component documentation
2. Review component source code in `/components/ui`
3. Test in different browsers and devices
4. Validate responsive behavior at all breakpoints

## Resources

- Design System: `DESIGN_SYSTEM.md`
- Component Library: `/src/components/ui`
- Layout Components: `/src/components/layout`
- Page Examples: `/src/pages`
