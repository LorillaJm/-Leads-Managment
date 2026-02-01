# Apple-Inspired Design System

## Overview

This design system implements a premium, Apple-inspired UI for the LeadFlow business application. Every component and interaction is crafted to feel as polished as apple.com, iOS system apps, and Apple admin tools.

## Core Philosophy

- **Minimal & Confident**: Clean interfaces with purposeful whitespace
- **Calm & Human**: Smooth animations that feel natural, never distracting
- **Premium Quality**: Every detail matters - from shadows to transitions
- **Accessibility First**: Full keyboard navigation and WCAG compliance

## Color System

### Base Palette
- **Background**: Soft off-white (`hsl(0 0% 98%)`) - never pure white
- **Foreground**: Deep charcoal (`hsl(240 10% 10%)`)
- **Primary**: Apple-like blue (`hsl(213 94% 55%)`)
- **Muted**: Subtle gray tones for secondary content

### Usage Rules
- Use accent color (primary) ONLY for:
  - Primary action buttons
  - Key highlights and active states
  - Important status indicators
- Borders are ultra-light with low contrast
- Cards use translucent white with backdrop blur

## Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 
             'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif
```

### Scale
- **Hero**: 4xl (36px) - Page titles
- **Title**: 2xl (24px) - Card headers
- **Body**: sm (14px) - Default text
- **Caption**: xs (12px) - Metadata

### Weights
- **Semibold (600)**: Headings and emphasis
- **Medium (500)**: Labels and UI elements
- **Regular (400)**: Body text

## Components

### Cards
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

**Features**:
- Glass morphism effect with backdrop blur
- Rounded corners (16-24px)
- Subtle elevation on hover
- Smooth transitions

### Buttons
```tsx
<Button variant="default">Primary Action</Button>
<Button variant="outline">Secondary Action</Button>
<Button variant="ghost">Tertiary Action</Button>
```

**Features**:
- iOS-style press effect (scale down on click)
- Smooth hover transitions
- Clear visual hierarchy
- Accessible focus states

### Tables
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Column</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Data</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

**Features**:
- No heavy borders - uses subtle separators
- Sticky header with blur background
- Smooth row hover states
- Hidden action buttons (appear on hover)

### Inputs
```tsx
<Input 
  type="text" 
  placeholder="Enter text..."
/>
```

**Features**:
- Rounded, tactile appearance
- Smooth focus transitions
- Subtle hover states
- Clear visual feedback

## Layout System

### Desktop (≥1024px)
- Fixed sidebar (288px width)
- Top bar with search
- Main content area with max-width constraint
- Generous padding and spacing

### Tablet (768px - 1023px)
- Collapsible sidebar
- Touch-friendly spacing
- Optimized card layouts

### Mobile (<768px)
- Bottom navigation (iOS-style)
- Full-width cards
- Drawer-based filters
- Large tap targets (44px minimum)

## Motion & Animation

### Principles
- **Smooth**: Use cubic-bezier easing
- **Quick**: 200-300ms for most transitions
- **Purposeful**: Animations guide attention

### Common Patterns
```tsx
// Fade in with slide
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.3 }}

// Press effect
className="press-effect" // active:scale-[0.98]

// Staggered list
transition={{ delay: index * 0.05 }}
```

### Transitions
- **Page transitions**: Fade + slight slide
- **Card hover**: Subtle elevation increase
- **Button press**: Scale down to 98%
- **Drawer/Modal**: Spring animation

## Spacing System

Based on 4px grid:
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **2xl**: 48px

## Elevation (Shadows)

### Levels
```css
/* Small - Buttons, inputs */
.elevation-sm {
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

/* Medium - Cards */
.elevation-md {
  box-shadow: 0 2px 8px 0 rgb(0 0 0 / 0.04), 
              0 1px 2px 0 rgb(0 0 0 / 0.06);
}

/* Large - Modals, drawers */
.elevation-lg {
  box-shadow: 0 4px 16px 0 rgb(0 0 0 / 0.04), 
              0 2px 4px 0 rgb(0 0 0 / 0.06);
}
```

## Glass Morphism

```css
.glass {
  background: hsl(var(--glass));
  backdrop-filter: blur(20px) saturate(180%);
}

.glass-strong {
  background: hsl(var(--glass));
  backdrop-filter: blur(40px) saturate(200%);
}
```

**Usage**:
- Sidebar and navigation
- Sticky headers
- Overlays and modals
- Floating elements

## Advanced Features

### Command Palette
- Global search (⌘K / Ctrl+K)
- Quick navigation
- Action shortcuts
- Fuzzy search

### Empty States
```tsx
<EmptyState
  icon={Icon}
  title="No items found"
  description="Get started by adding your first item."
  action={{
    label: "Add Item",
    onClick: handleAdd
  }}
/>
```

### Skeleton Loaders
```tsx
<Skeleton className="h-16 w-full" />
```

**Rules**:
- Match final layout shape
- Use instead of spinners
- Smooth transition to content

### Stat Cards
```tsx
<StatCard
  title="Total Revenue"
  value="$125,000"
  change={{ value: 23, trend: 'up' }}
  icon={DollarSign}
  delay={0.1}
/>
```

## Responsive Behavior

### Breakpoints
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

### Mobile Optimizations
- Bottom navigation instead of sidebar
- Drawer-based filters and actions
- Full-width cards
- Larger touch targets
- Simplified layouts
- No horizontal scrolling

### Touch Interactions
- 44px minimum tap target
- Swipe gestures for drawers
- Pull-to-refresh (where applicable)
- Long-press for context menus

## Accessibility

### Keyboard Navigation
- Tab order follows visual hierarchy
- Focus indicators are clear and visible
- Escape closes modals/drawers
- Arrow keys for lists and menus

### Screen Readers
- Semantic HTML elements
- ARIA labels where needed
- Live regions for dynamic content
- Skip links for navigation

### Color Contrast
- WCAG AA compliant (4.5:1 minimum)
- Focus states have 3:1 contrast
- Interactive elements are distinguishable

## Performance

### Optimization Strategies
- Lazy load images and heavy components
- Debounce search inputs
- Virtual scrolling for long lists
- Code splitting by route
- Optimize animations (use transform/opacity)

### Best Practices
- Use CSS transforms for animations
- Avoid layout thrashing
- Minimize re-renders
- Optimize bundle size

## Implementation Checklist

- [x] Design tokens (colors, spacing, typography)
- [x] Core UI components (Button, Card, Input, Table)
- [x] Layout system (Sidebar, TopBar, Mobile Nav)
- [x] Responsive behavior (Desktop, Tablet, Mobile)
- [x] Command palette (⌘K)
- [x] Glass morphism effects
- [x] Smooth animations and transitions
- [x] Empty states and skeletons
- [x] Stat cards and data visualization
- [x] Drawer and dialog components
- [x] Badge and status indicators
- [x] Mobile bottom navigation
- [x] Accessibility features

## Future Enhancements

- [ ] Dark mode toggle
- [ ] Chart components with Recharts
- [ ] Advanced filters with slide-over
- [ ] Inline editing in tables
- [ ] Drag-and-drop support
- [ ] Real-time notifications
- [ ] Advanced search with filters
- [ ] Export functionality
- [ ] Bulk actions
- [ ] Customizable dashboard widgets

## Resources

- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Primitives](https://www.radix-ui.com/)
- [Framer Motion](https://www.framer.com/motion/)
