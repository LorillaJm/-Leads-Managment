# DASHBOARD DESIGN SYSTEM 🎨

## Card-Based Layout Reference

### Card Anatomy
```
┌─────────────────────────────────────────┐
│ Card Header (border-bottom)            │
│ ┌─────┐                                 │
│ │Icon │ Title          [Show more →]   │
│ └─────┘                                 │
├─────────────────────────────────────────┤
│                                         │
│         Card Content                    │
│         (Chart or Data)                 │
│                                         │
└─────────────────────────────────────────┘
```

### Card Specifications
- **Background:** `bg-white/70` (70% opacity white)
- **Backdrop:** `backdrop-blur-sm` (glass effect)
- **Border:** `border-zinc-200/60` (soft, semi-transparent)
- **Padding:** `p-6` (24px)
- **Hover:** `hover:shadow-md` (subtle elevation)
- **Transition:** `transition-shadow` (smooth)

---

## Color System

### Primary Palette
```css
--zinc-50:  #fafafa  /* Background */
--zinc-100: #f4f4f5  /* Light elements */
--zinc-200: #e4e4e7  /* Borders */
--zinc-600: #52525b  /* Secondary text */
--zinc-900: #18181b  /* Primary text */
```

### Accent Colors
```css
--primary:     #007AFF  /* Apple Blue */
--success:     #34C759  /* Apple Green */
--warning:     #FF9500  /* Apple Orange */
--destructive: #FF3B30  /* Apple Red */
--purple:      #AF52DE  /* Purple */
--teal:        #5AC8FA  /* Teal */
```

### Usage Guidelines
- **Primary (Blue):** Main actions, links, primary charts
- **Success (Green):** Positive metrics, closed deals
- **Warning (Orange):** Warm leads, reservations
- **Destructive (Red):** Hot leads, urgent items
- **Purple:** Test drives, secondary metrics
- **Teal:** Bank applications, special features

---

## Typography Scale

### Hierarchy
```
Page Title:      text-3xl (36px) font-semibold
Section Header:  text-2xl (24px) font-semibold
Card Title:      text-xl (20px) font-semibold
Large Number:    text-4xl (36px) font-semibold
Medium Number:   text-3xl (30px) font-semibold
Body Text:       text-sm (14px)
Small Text:      text-xs (12px)
```

### Font Weights
- **Semibold (600):** Titles, numbers, emphasis
- **Medium (500):** Labels, secondary headers
- **Normal (400):** Body text, descriptions

---

## Spacing System

### Container
```css
max-width: 1400px
padding: 0 24px (px-6)
margin: 0 auto
```

### Sections
```css
gap: 32px (space-y-8)
padding-top: 32px (py-8)
```

### Cards
```css
gap: 16px-24px (gap-4 to gap-6)
padding: 24px (p-6)
```

### Grids
```css
Desktop:  gap-6 (24px)
Tablet:   gap-4 (16px)
Mobile:   gap-4 (16px)
```

---

## Grid System

### Scope Section (KPIs)
```css
Desktop:  grid-cols-4 (4 columns)
Tablet:   grid-cols-2 (2 columns)
Mobile:   grid-cols-1 (1 column)
```

### Overview Section (Interest)
```css
Desktop:  grid-cols-3 (3 columns)
Tablet:   grid-cols-3 (wraps to 2)
Mobile:   grid-cols-1 (1 column)
```

### Chart Sections
```css
Desktop:  grid-cols-2 (2 columns)
Tablet:   grid-cols-2 (may stack)
Mobile:   grid-cols-1 (1 column)
```

---

## Icon System

### Icon Sizes
```css
Small:   w-4 h-4 (16px)
Medium:  w-5 h-5 (20px)
Large:   w-6 h-6 (24px)
XLarge:  w-7 h-7 (28px)
XXLarge: w-8 h-8 (32px)
```

### Icon Containers
```css
Small:   w-10 h-10 rounded-xl
Medium:  w-12 h-12 rounded-xl
Large:   w-14 h-14 rounded-xl
XLarge:  w-16 h-16 rounded-2xl
```

### Icon Background
```css
background: ${color}15 (15% opacity)
Example: rgba(0, 122, 255, 0.15)
```

---

## Chart Styling

### Common Configuration
```tsx
<ResponsiveContainer width="100%" height={300}>
  <Chart>
    {/* Grid */}
    <CartesianGrid 
      strokeDasharray="3 3" 
      stroke="#f4f4f5" 
    />
    
    {/* Axes */}
    <XAxis 
      stroke="#71717a" 
      style={{ fontSize: '12px' }} 
    />
    <YAxis 
      stroke="#71717a" 
      style={{ fontSize: '12px' }} 
    />
    
    {/* Tooltip */}
    <Tooltip 
      contentStyle={{
        backgroundColor: 'white',
        border: '1px solid #e4e4e7',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
    />
    
    {/* Data */}
    <Bar 
      dataKey="value"
      fill={COLORS.primary}
      radius={[8, 8, 0, 0]}
      animationDuration={800}
    />
  </Chart>
</ResponsiveContainer>
```

### Chart Heights
```css
Small:   250px
Medium:  300px
Large:   400px
XLarge:  500px
```

---

## Animation System

### Page Load
```tsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5 }}
```

### Stagger Pattern
```tsx
Section 1: delay: 0.0s
Section 2: delay: 0.2s
Section 3: delay: 0.4s
Section 4: delay: 0.5s
Section 5: delay: 0.6s
Section 6: delay: 0.7s
Section 7: delay: 0.8s
Section 8: delay: 0.9s
```

### Card Stagger
```tsx
Card 1: delay: 0.0s
Card 2: delay: 0.1s
Card 3: delay: 0.2s
Card 4: delay: 0.3s
```

### Chart Animation
```tsx
animationDuration={800}
```

---

## Button System

### Show More Link
```tsx
<button className="
  text-sm 
  text-primary 
  hover:text-primary/80 
  transition-colors 
  flex items-center gap-1
">
  Show more
  <ChevronRight className="w-4 h-4" />
</button>
```

### Hover States
```css
Default:  text-primary
Hover:    text-primary/80 (80% opacity)
Transition: transition-colors
```

---

## Responsive Breakpoints

### Tailwind Breakpoints
```css
sm:  640px  (Small tablets)
md:  768px  (Tablets)
lg:  1024px (Desktops)
xl:  1280px (Large desktops)
2xl: 1536px (Extra large)
```

### Usage Pattern
```tsx
className="
  grid-cols-1           /* Mobile */
  sm:grid-cols-2        /* Small tablet */
  md:grid-cols-3        /* Tablet */
  lg:grid-cols-4        /* Desktop */
"
```

---

## Loading States

### Skeleton Loader
```tsx
{isLoading ? (
  <Skeleton className="h-[300px] w-full" />
) : (
  <Chart />
)}
```

### Skeleton Styling
```css
background: linear-gradient(
  90deg,
  #f4f4f5 0%,
  #e4e4e7 50%,
  #f4f4f5 100%
)
animation: shimmer 2s infinite
```

---

## Accessibility

### Focus States
```css
focus:outline-none
focus:ring-2
focus:ring-primary
focus:ring-offset-2
```

### Color Contrast
- Text on white: WCAG AA compliant
- Icons: Sufficient contrast
- Charts: Distinguishable colors

### Keyboard Navigation
- All interactive elements focusable
- Logical tab order
- Clear focus indicators

---

## Component Patterns

### KPI Card
```tsx
<Card className="bg-white/70 backdrop-blur-sm border-zinc-200/60">
  <CardContent className="p-6">
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <p className="text-sm font-medium text-zinc-600">
          {title}
        </p>
        <p className="text-3xl font-semibold text-zinc-900">
          {value}
        </p>
      </div>
      <div className="w-12 h-12 rounded-xl bg-primary/15">
        <Icon className="w-6 h-6 text-primary" />
      </div>
    </div>
  </CardContent>
</Card>
```

### Chart Card
```tsx
<Card className="bg-white/70 backdrop-blur-sm border-zinc-200/60">
  <CardHeader className="border-b border-zinc-100">
    <div className="flex items-center justify-between">
      <CardTitle className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-primary" />
        {title}
      </CardTitle>
      <button className="text-sm text-primary">
        Show more <ChevronRight />
      </button>
    </div>
  </CardHeader>
  <CardContent className="p-6">
    <ResponsiveContainer>
      <Chart />
    </ResponsiveContainer>
  </CardContent>
</Card>
```

---

## Best Practices

### DO ✅
- Use consistent spacing (multiples of 4px)
- Apply glass effects to cards
- Use single accent color (blue)
- Add subtle animations
- Maintain visual hierarchy
- Use semantic HTML
- Test on all devices
- Optimize performance

### DON'T ❌
- Use multiple accent colors
- Add heavy shadows
- Create sharp corners
- Overuse animations
- Clutter the interface
- Use inline styles
- Ignore accessibility
- Break responsive layout

---

## Maintenance

### Adding New Sections
1. Follow card pattern
2. Use consistent spacing
3. Add staggered animation
4. Include "Show more" link
5. Test responsiveness
6. Verify accessibility

### Updating Colors
1. Update COLORS constant
2. Maintain contrast ratios
3. Test in light/dark modes
4. Verify chart colors
5. Check icon backgrounds

### Performance Tips
- Use `useMemo` for data transformations
- Optimize chart rendering
- Lazy load heavy components
- Use skeleton loaders
- Minimize re-renders

---

## 🎯 Design Principles

1. **Clarity:** Information is easy to find and understand
2. **Consistency:** Patterns repeat throughout
3. **Hierarchy:** Important info stands out
4. **Simplicity:** No unnecessary elements
5. **Elegance:** Polished and refined
6. **Responsiveness:** Works on all devices
7. **Performance:** Fast and smooth
8. **Accessibility:** Usable by everyone

---

**This design system ensures consistency, maintainability, and scalability for the dashboard!** 🚀
