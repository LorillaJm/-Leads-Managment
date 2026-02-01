# 🎨 Visual Showcase - Apple-Inspired UI

## Design Philosophy

> "Design is not just what it looks like and feels like. Design is how it works." - Steve Jobs

This UI system embodies Apple's design principles: simplicity, clarity, and attention to detail.

## Color System

### Light Mode (Default)
```
Background:     #FAFAFA (Soft off-white)
Foreground:     #1A1A1A (Deep charcoal)
Primary:        #3B82F6 (Apple blue)
Muted:          #F4F4F5 (Subtle gray)
Border:         #E4E4E7 (Ultra-light)
```

### Accent Usage
The primary blue is used **sparingly** for:
- Primary action buttons
- Active navigation items
- Key status indicators
- Focus states

## Typography

### Font Hierarchy
```
Hero (4xl):     36px / Semibold - Page titles
Title (2xl):    24px / Semibold - Card headers
Body (sm):      14px / Regular  - Default text
Caption (xs):   12px / Regular  - Metadata
```

### Font Stack
```css
-apple-system, BlinkMacSystemFont, 'SF Pro Display',
'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif
```

## Component Showcase

### Buttons

**Primary Button**
- Solid blue background
- White text
- Subtle shadow
- Hover: Slightly darker + elevated shadow
- Active: Scale down to 98% (press effect)

**Secondary Button**
- Transparent background
- Border outline
- Hover: Subtle background tint

**Ghost Button**
- No background or border
- Hover: Subtle background

### Cards

**Glass Card**
- Semi-transparent white background
- Backdrop blur (20px)
- Subtle border
- Rounded corners (16-24px)
- Hover: Elevated shadow

**Features:**
- Floats naturally on page
- Never boxed tightly
- Generous padding
- Smooth transitions

### Tables

**Apple-Style Data Table**
- No heavy borders
- Subtle row separators
- Sticky header with blur
- Hover: Subtle background change
- Hidden actions (appear on row hover)

**Header:**
- Glass morphism background
- Uppercase labels
- Subtle text color
- Sticky positioning

### Inputs

**Text Input**
- Rounded corners (12px)
- Subtle border
- Transparent background
- Focus: Blue ring + border color change
- Hover: Border color lightens

**Select Dropdown**
- Same styling as input
- Chevron icon
- Smooth dropdown animation
- Glass morphism menu

## Layout System

### Desktop (≥1024px)
```
┌─────────────────────────────────────┐
│  Sidebar (288px)  │  Main Content   │
│  - Glass effect   │  - Max width    │
│  - Fixed position │  - Centered     │
│  - Navigation     │  - Padding      │
└─────────────────────────────────────┘
```

### Tablet (768-1023px)
```
┌─────────────────────────────────────┐
│  [≡]  TopBar with Search            │
├─────────────────────────────────────┤
│  Main Content (Full Width)          │
│  - 2-column grids                   │
│  - Touch-friendly spacing           │
└─────────────────────────────────────┘
```

### Mobile (<768px)
```
┌─────────────────────────────────────┐
│  [≡]  TopBar                        │
├─────────────────────────────────────┤
│  Main Content                       │
│  - Full-width cards                 │
│  - Single column                    │
│  - Large touch targets              │
├─────────────────────────────────────┤
│  [🏠] [📊] [✓] [📈]  Bottom Nav     │
└─────────────────────────────────────┘
```

## Animation Patterns

### Page Entrance
```tsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.3 }}
```

### Staggered List
```tsx
transition={{ delay: index * 0.05 }}
```

### Button Press
```css
active:scale-[0.98]
transition: transform 100ms
```

### Drawer Slide
```tsx
initial={{ x: '100%' }}
animate={{ x: 0 }}
transition={{ type: 'spring', damping: 30, stiffness: 300 }}
```

## Glass Morphism

### Standard Glass
```css
background: rgba(255, 255, 255, 0.7)
backdrop-filter: blur(20px) saturate(180%)
```

### Strong Glass (Navigation)
```css
background: rgba(255, 255, 255, 0.7)
backdrop-filter: blur(40px) saturate(200%)
```

**Usage:**
- Sidebar and navigation
- Sticky table headers
- Modal overlays
- Floating elements

## Elevation System

### Level 1 - Subtle
```css
box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05)
```
**Usage:** Buttons, inputs, small cards

### Level 2 - Medium
```css
box-shadow: 
  0 2px 8px 0 rgb(0 0 0 / 0.04),
  0 1px 2px 0 rgb(0 0 0 / 0.06)
```
**Usage:** Cards, dropdowns

### Level 3 - Strong
```css
box-shadow:
  0 4px 16px 0 rgb(0 0 0 / 0.04),
  0 2px 4px 0 rgb(0 0 0 / 0.06)
```
**Usage:** Modals, drawers, command palette

## Spacing Scale

```
xs:   4px   - Tight spacing
sm:   8px   - Small gaps
md:   16px  - Default spacing
lg:   24px  - Section spacing
xl:   32px  - Large sections
2xl:  48px  - Page sections
```

## Interactive States

### Hover
- Subtle background color change
- Border color lightens
- Shadow elevates slightly
- Transition: 200ms

### Focus
- Blue ring (2px)
- Border color changes to blue
- No outline (custom ring)
- Accessible contrast

### Active/Press
- Scale down to 98%
- Instant feedback (100ms)
- Returns to normal on release

### Disabled
- Opacity: 50%
- Cursor: not-allowed
- No hover effects

## Page Examples

### Dashboard
```
┌─────────────────────────────────────┐
│  Dashboard                          │
│  Welcome back! Here's what's...     │
├─────────────────────────────────────┤
│  [Stat] [Stat] [Stat] [Stat]       │
├─────────────────────────────────────┤
│  [Chart Card]  │  [Activity Card]   │
└─────────────────────────────────────┘
```

### Leads Table
```
┌─────────────────────────────────────┐
│  Leads                    [+ Add]   │
├─────────────────────────────────────┤
│  [Search...] [Filters]              │
├─────────────────────────────────────┤
│  Company │ Contact │ Status │ Value │
│  ────────┼─────────┼────────┼───────│
│  Acme    │ John    │ New    │ $5k   │
│  (hover shows action buttons)       │
└─────────────────────────────────────┘
```

### Login
```
┌─────────────────────────────────────┐
│                                     │
│         [Logo]                      │
│       LeadFlow                      │
│   Sign in to your account           │
│                                     │
│   Email: [____________]             │
│   Password: [____________]          │
│                                     │
│   [Sign in]                         │
│                                     │
│   Forgot password?                  │
└─────────────────────────────────────┘
```

## Mobile Optimizations

### Touch Targets
- Minimum 44px height
- Generous padding
- Clear tap feedback

### Bottom Navigation
- iOS-style design
- 4-5 primary actions
- Active indicator
- Smooth transitions

### Drawers
- Slide from side
- Spring animation
- Backdrop blur
- Swipe to close

## Accessibility

### Keyboard Navigation
- Tab order follows visual hierarchy
- Focus indicators are clear
- Escape closes modals
- Arrow keys for lists

### Color Contrast
- Text: 4.5:1 minimum (WCAG AA)
- Interactive elements: 3:1
- Focus indicators: 3:1

### Screen Readers
- Semantic HTML
- ARIA labels
- Live regions
- Skip links

## Performance

### Optimizations
- CSS transforms for animations
- Debounced search inputs
- Lazy loading
- Code splitting
- Optimized bundle size

### Best Practices
- Use transform/opacity for animations
- Avoid layout thrashing
- Minimize re-renders
- Virtual scrolling for long lists

## Design Tokens

### CSS Variables
```css
--background: 0 0% 98%
--foreground: 240 10% 10%
--primary: 213 94% 55%
--muted: 240 5% 96%
--border: 240 6% 90%
--radius: 1rem
```

### Tailwind Classes
```css
.glass - Glass morphism effect
.elevation-sm - Small shadow
.elevation-md - Medium shadow
.elevation-lg - Large shadow
.press-effect - iOS-style press
```

## Inspiration

This design system draws inspiration from:
- **apple.com** - Clean, minimal aesthetic
- **iOS System Apps** - Smooth interactions
- **Apple Admin Tools** - Professional data views
- **macOS Big Sur** - Glass morphism effects

## Quality Standards

Every component meets these criteria:
- ✅ Visually consistent
- ✅ Smooth animations
- ✅ Responsive design
- ✅ Accessible
- ✅ Performant
- ✅ Well-documented

---

**"Simplicity is the ultimate sophistication."** - Leonardo da Vinci
