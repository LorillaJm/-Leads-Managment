# Performance & Ranking System - UI Showcase

## 🎨 Apple-Inspired Design Philosophy

This system embodies Apple's design principles: simplicity, elegance, and attention to detail. Every element is crafted to provide a premium user experience.

## 🌟 Key Design Elements

### 1. Glass Morphism Effects

**Implementation:**
```tsx
className="bg-background/60 backdrop-blur-xl border-border/50"
```

**Visual Characteristics:**
- Semi-transparent backgrounds (60% opacity)
- Backdrop blur for depth
- Subtle borders (50% opacity)
- Layered appearance

**Where Used:**
- Main cards
- Chart containers
- Ranking table
- Dropdown menus

### 2. Gradient Backgrounds

**KPI Cards:**
```tsx
// Blue - Leads
className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20"

// Emerald - Conversions
className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20"

// Purple - Revenue
className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20"

// Amber - Activities
className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20"
```

**Visual Effect:**
- Subtle color wash
- Directional gradient (bottom-right)
- Low opacity for elegance
- Matching border colors

### 3. Rank Badges

**Gold (1st Place):**
```tsx
className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 
           text-amber-600 dark:text-amber-400 
           border border-amber-500/30"
```
Icon: 🏆 Trophy

**Silver (2nd Place):**
```tsx
className="bg-gradient-to-br from-slate-400/20 to-slate-500/10 
           text-slate-600 dark:text-slate-400 
           border border-slate-400/30"
```
Icon: 🥈 Medal

**Bronze (3rd Place):**
```tsx
className="bg-gradient-to-br from-amber-700/20 to-amber-800/10 
           text-amber-700 dark:text-amber-500 
           border border-amber-700/30"
```
Icon: 🥉 Award

### 4. Micro-Animations

**Page Load Animation:**
```tsx
<motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
```

**Staggered Card Animation:**
```tsx
<StatCard delay={0} />    // First card
<StatCard delay={0.1} />  // Second card
<StatCard delay={0.2} />  // Third card
<StatCard delay={0.3} />  // Fourth card
```

**Hover Effects:**
```tsx
className="hover:scale-[1.02] transition-transform duration-300"
className="hover:bg-muted/20 transition-colors"
```

**Table Row Animation:**
```tsx
<motion.tr
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.05 }}
>
```

### 5. Typography Hierarchy

**Page Title:**
```tsx
className="text-4xl font-semibold tracking-tight 
           bg-gradient-to-br from-foreground to-foreground/70 
           bg-clip-text"
```

**Card Title:**
```tsx
className="text-xl font-semibold"
```

**Metric Value:**
```tsx
className="text-3xl font-semibold tracking-tight"
```

**Secondary Text:**
```tsx
className="text-sm text-muted-foreground"
```

### 6. Color System

**Primary Colors:**
```css
Blue (#3b82f6)    - Leads, Primary actions
Emerald (#10b981) - Success, Conversions
Purple (#8b5cf6)  - Revenue, Premium
Amber (#f59e0b)   - Rankings, Achievements
```

**Semantic Colors:**
```css
Success: emerald-600 / emerald-400 (dark)
Error: red-600 / red-400 (dark)
Warning: amber-600 / amber-400 (dark)
Info: blue-600 / blue-400 (dark)
```

**Neutral Colors:**
```css
Background: background
Foreground: foreground
Muted: muted / muted-foreground
Border: border
```

### 7. Spacing System

**Container Spacing:**
```tsx
className="space-y-8 pb-8"  // Vertical spacing between sections
```

**Grid Gaps:**
```tsx
className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
```

**Card Padding:**
```tsx
className="p-6"   // Standard card padding
className="px-6 py-4"  // Table cell padding
```

### 8. Border Radius

**Cards:**
```tsx
className="rounded-xl"  // 0.75rem
```

**Badges:**
```tsx
className="rounded-full"  // Full circle
```

**Buttons:**
```tsx
className="rounded-lg"  // 0.5rem
```

## 📱 Responsive Design Patterns

### Desktop Layout (≥1024px)
```tsx
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
  {/* 4 columns on large screens */}
</div>
```

### Tablet Layout (768px - 1023px)
```tsx
<div className="grid gap-6 md:grid-cols-2">
  {/* 2 columns on medium screens */}
</div>
```

### Mobile Layout (<768px)
```tsx
<div className="grid gap-6">
  {/* Single column on small screens */}
</div>
```

## 🎭 Component Showcase

### KPI Card
```
┌─────────────────────────────────┐
│ Leads Created              [📊] │
│                                 │
│ 45                              │
│                                 │
│ ↗️ +12% vs last month           │
└─────────────────────────────────┘
```

**Features:**
- Gradient background
- Icon in colored circle
- Large metric value
- Trend indicator
- Hover scale effect

### Performance Chart
```
┌─────────────────────────────────────────┐
│ Performance Trends          [Monthly] ▼ │
├─────────────────────────────────────────┤
│                                         │
│     📈 Interactive Line Chart           │
│     • Leads (Blue)                      │
│     • Conversions (Green)               │
│     • Revenue (Purple)                  │
│                                         │
│     [Hover for details]                 │
│                                         │
└─────────────────────────────────────────┘
```

**Features:**
- Glass morphism container
- Three colored trend lines
- Custom tooltip
- Gradient fills
- Responsive sizing

### Ranking Table
```
┌──────────────────────────────────────────────────────────┐
│ Sales Consultant Rankings                                │
│ [All Time] [This Month vs Last] ←Tabs                   │
├──────────────────────────────────────────────────────────┤
│ Rank  Name           Leads  Deals  Conv%  Revenue       │
├──────────────────────────────────────────────────────────┤
│ 🏆#1  John Doe       45     12     26.7%  $180,000      │
│                      ↗️+5%  ↗️+2   ↗️+1.2%  ↗️+15%       │
├──────────────────────────────────────────────────────────┤
│ 🥈#2  Jane Smith     38     10     26.3%  $150,000      │
│                      ↗️+3%  ↘️-1   ↘️-0.5%  ↗️+10%       │
├──────────────────────────────────────────────────────────┤
│ 🥉#3  Mike Johnson   35     9      25.7%  $135,000      │
│                      ↗️+2%  ➖0    ↗️+0.3%  ↗️+8%        │
└──────────────────────────────────────────────────────────┘
```

**Features:**
- Visual rank badges
- Sortable columns
- Trend indicators
- Comparison mode
- Highlighted top 3

### Trend Indicators
```
Positive: ↗️ +12.5% (Green)
Negative: ↘️ -5.2%  (Red)
Neutral:  ➖ 0%     (Gray)
```

### Quick Insight Card
```
┌─────────────────────────────────┐
│ Avg. Conversion Time       [📅] │
│                                 │
│ 14 days                         │
│                                 │
│ ↘️ 2 days faster than last      │
└─────────────────────────────────┘
```

## 🌓 Dark Mode Support

All components support dark mode with proper color adjustments:

**Light Mode:**
- Bright backgrounds
- Dark text
- Subtle shadows

**Dark Mode:**
- Dark backgrounds
- Light text
- Glowing effects

**Implementation:**
```tsx
className="text-blue-600 dark:text-blue-400"
className="bg-white dark:bg-slate-900"
className="border-gray-200 dark:border-gray-800"
```

## ✨ Interactive Elements

### Hover States
- Cards scale up slightly (1.02x)
- Background color changes
- Cursor changes to pointer
- Smooth transitions

### Click States
- Ripple effect (future enhancement)
- Immediate visual feedback
- State change indication

### Focus States
- Visible focus rings
- Keyboard navigation support
- Accessibility compliant

## 🎯 Accessibility Features

### Color Contrast
- WCAG AA compliant
- Minimum 4.5:1 ratio for text
- 3:1 ratio for large text

### Keyboard Navigation
- Tab through interactive elements
- Enter to activate
- Escape to close modals

### Screen Reader Support
- Semantic HTML
- ARIA labels where needed
- Descriptive alt text

## 📐 Layout Principles

### Whitespace
- Generous padding (1.5rem - 2rem)
- Consistent gaps (1.5rem)
- Breathing room around elements

### Alignment
- Left-aligned text
- Centered icons
- Right-aligned numbers

### Grouping
- Related items grouped
- Clear visual separation
- Logical information hierarchy

## 🎨 Design Tokens

```typescript
// Spacing
const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
}

// Border Radius
const borderRadius = {
  sm: '0.25rem',   // 4px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  full: '9999px',  // Circle
}

// Shadows
const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
}
```

## 🖼️ Visual Hierarchy

**Level 1: Page Title**
- Largest text (4xl)
- Gradient effect
- Top of page

**Level 2: Section Headers**
- Large text (xl)
- Semibold weight
- Card headers

**Level 3: Metric Values**
- Large text (3xl)
- Semibold weight
- Primary focus

**Level 4: Labels**
- Small text (sm)
- Muted color
- Supporting information

## 🎬 Animation Timing

```typescript
// Duration
const duration = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
}

// Easing
const easing = {
  default: 'cubic-bezier(0.4, 0, 0.2, 1)',
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  out: 'cubic-bezier(0, 0, 0.2, 1)',
  inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
}
```

## 🏆 Best Practices

1. **Consistency**: Use design tokens throughout
2. **Simplicity**: Remove unnecessary elements
3. **Clarity**: Make information easy to understand
4. **Feedback**: Provide immediate visual feedback
5. **Performance**: Optimize animations and transitions
6. **Accessibility**: Support all users
7. **Responsiveness**: Work on all devices
8. **Dark Mode**: Support both themes

## 📱 Mobile-First Approach

Start with mobile design, then enhance for larger screens:

```tsx
// Mobile first
className="text-2xl"

// Then tablet
className="text-2xl md:text-3xl"

// Then desktop
className="text-2xl md:text-3xl lg:text-4xl"
```

## 🎨 Color Psychology

- **Blue**: Trust, professionalism, stability
- **Emerald**: Success, growth, positive
- **Purple**: Premium, luxury, quality
- **Amber**: Achievement, excellence, reward

---

**Design System Version**: 1.0.0
**Last Updated**: February 1, 2026
**Design Philosophy**: Apple-inspired minimalism with premium feel
