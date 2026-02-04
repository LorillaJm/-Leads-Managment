# Dashboard Visual Showcase

## 🎨 Design System

### Color Palette

#### KPI Cards
```
LEADS:              #374151 (Gray-700)
PROSPECTS:          #3B82F6 (Blue-500)
TEST DRIVES:        #60A5FA (Blue-400)
RESERVATIONS:       #93C5FD (Blue-300)
BANK APPLICATIONS:  #EAB308 (Yellow-500)
CLOSED DEALS:       #16A34A (Green-600)
```

#### Chart Colors
```
Leads:              #F59E0B (Amber-500)
Prospects:          #3B82F6 (Blue-500)
Test Drives:        #06B6D4 (Cyan-500)
Reservations:       #8B5CF6 (Violet-500)
Bank Applications:  #EC4899 (Pink-500)
Closed Deals:       #10B981 (Emerald-500)
```

#### UI Elements
```
Background:         #F9FAFB (Gray-50)
Cards:              #FFFFFF (White)
Borders:            #E5E7EB (Gray-200)
Text Primary:       #111827 (Gray-900)
Text Secondary:     #6B7280 (Gray-500)
Blue Header:        #2563EB (Blue-600)
Cyan Dropdown:      #06B6D4 (Cyan-400)
```

### Typography

#### Headers
```
Dashboard Title:    text-lg font-bold
Section Headers:    text-lg font-bold
Card Labels:        text-sm font-semibold
```

#### Body Text
```
KPI Values:         text-4xl font-bold
Table Text:         text-sm
Labels:             text-xs font-medium
Goals:              text-xs text-gray-500
```

### Spacing

#### Padding
```
Header:             px-6 py-4
Sidebar:            p-4
KPI Cards:          p-4
Main Content:       p-6
Card Content:       p-6
```

#### Gaps
```
KPI Stack:          space-y-3
Main Grid:          gap-6
Activity Grid:      gap-4
Filter Items:       space-y-1.5
```

### Border Radius
```
Cards:              rounded-lg (8px)
KPI Cards:          rounded-lg (8px)
Buttons:            rounded (4px)
Dropdowns:          rounded-xl (12px)
```

### Shadows
```
Cards:              shadow-sm
Tables:             shadow-sm
Dropdowns:          elevation-lg
```

## 📐 Layout Structure

### Desktop Layout (≥1024px)
```
┌─────────────────────────────────────────────────────────────┐
│                         HEADER                               │
├──────────┬──────────┬─────────────────────────┬─────────────┤
│          │          │                         │             │
│ FILTERS  │   KPI    │    MAIN CONTENT         │   SALES     │
│  (192px) │  (224px) │                         │   TEAM      │
│          │          │  - Overview             │   TABLE     │
│  Year    │  Leads   │  - Conversion Flow      │  (384px)    │
│  Months  │  Prosp.  │  - Activity Breakdown   │             │
│  Consult.│  Test Dr.│  - Analytics Chart      │             │
│          │  Reserv. │                         │             │
│          │  Bank    │                         │             │
│          │  Closed  │                         │             │
│          │          │                         │             │
└──────────┴──────────┴─────────────────────────┴─────────────┘
```

### Mobile Layout (<1024px)
```
┌─────────────────────────┐
│        HEADER           │
├─────────────────────────┤
│   [Open Filters] ▼      │
├─────────────────────────┤
│                         │
│      KPI CARDS          │
│      (Stacked)          │
│                         │
├─────────────────────────┤
│                         │
│    MAIN CONTENT         │
│    (Full Width)         │
│                         │
│  - Overview             │
│  - Conversion Flow      │
│  - Activity Breakdown   │
│  - Sales Team Table     │
│  - Analytics Chart      │
│                         │
└─────────────────────────┘
```

## 🎭 Component Hierarchy

```
DashboardNew
├── DashboardHeader
│   ├── BYD Logo
│   ├── Dashboard Title
│   └── Admin Badges
│
├── FilterPanel
│   ├── Year Selector
│   ├── Month Checkboxes
│   └── Consultant Dropdown
│
├── KPIPanel
│   ├── Leads Card
│   ├── Prospects Card
│   ├── Test Drives Card
│   ├── Reservations Card
│   ├── Bank Applications Card
│   └── Closed Deals Card
│
├── Main Content Area
│   ├── OverviewPanel
│   ├── ConversionFlowPanel
│   │   ├── Conversion Metrics
│   │   └── Line Chart
│   ├── ActivityBreakdownPanel
│   │   ├── Test Drives
│   │   ├── Reservations
│   │   └── Bank Applications
│   └── AnalyticsChart
│       └── Multi-Category Bar Chart
│
└── SalesTeamTable
    ├── Table Header
    ├── Action Buttons
    ├── Column Headers
    └── Data Rows
```

## 🎬 Animation Timeline

### Page Load Sequence
```
0ms:    Header fades in (opacity 0 → 1)
50ms:   Filter panel slides in from left
100ms:  KPI cards stagger in (50ms delay each)
200ms:  Overview panel fades in
250ms:  Conversion flow panel fades in
300ms:  Activity breakdown fades in
350ms:  Sales team table slides in from right
400ms:  Analytics chart fades in
```

### Interaction Animations
```
Hover:      150ms ease-in-out
Click:      100ms ease-out
Sort:       200ms ease-in-out
Filter:     300ms ease-in-out
```

### Number Animations
```
KPI Values: Spring animation (type: 'spring')
Duration:   ~500ms
Easing:     Natural spring physics
```

## 📊 Data Visualization Patterns

### KPI Cards
```
┌─────────────────┐
│                 │
│      1,234      │  ← Large number (text-4xl)
│                 │
│      LEADS      │  ← Label (text-sm, uppercase)
│   (Goal: 1500)  │  ← Goal (text-xs)
│                 │
└─────────────────┘
```

### Conversion Flow
```
Leads → Prospects: 15%
Goal: 20%

Prospects → Closed Deals: 30%
Goal: 25%

[Line Chart Visualization]
```

### Activity Breakdown
```
┌──────────────┬──────────────┐
│ Test Drives  │ Reservations │
│     250      │     150      │
│ Min: 300     │ Min: 120     │
├──────────────┴──────────────┤
│    Bank Applications        │
│           200               │
│        Min: 180             │
└─────────────────────────────┘
```

### Sales Team Table
```
┌────────────────────────────────────────────────────┐
│ Sales Team                              [⊞] [⤢]   │
├────────────────────────────────────────────────────┤
│                                      Count: 10     │
├────────────────────────────────────────────────────┤
│ Consultant  │ Leads │ Prosp │ Test │ Res │ Bank │ Closed │
├─────────────┼───────┼───────┼──────┼─────┼──────┼────────┤
│ John Doe    │  150  │  45   │  30  │ 20  │  15  │   12   │
│ Jane Smith  │  140  │  42   │  28  │ 18  │  14  │   10   │
└────────────────────────────────────────────────────┘
```

## 🎯 Visual Hierarchy

### Primary Focus
1. **KPI Panel** - Immediate attention with bold colors
2. **Conversion Flow** - Key metrics for decision making
3. **Sales Team Table** - Detailed performance data

### Secondary Focus
1. **Overview** - Context setting
2. **Activity Breakdown** - Supporting metrics
3. **Analytics Chart** - Trend analysis

### Tertiary Focus
1. **Filters** - Control panel
2. **Header** - Branding and context

## 🌈 Visual States

### Default State
- Clean white cards
- Subtle borders
- Soft shadows
- Clear typography

### Hover State
- Slight elevation increase
- Border color intensifies
- Smooth transition (150ms)
- Cursor changes to pointer

### Active State
- Pressed effect
- Slightly darker background
- Quick transition (100ms)

### Loading State
- Skeleton placeholders
- Pulsing animation
- Gray backgrounds
- Maintains layout structure

### Empty State
- Centered message
- Icon indicator
- Helpful text
- Call-to-action button

## 📱 Responsive Breakpoints

### Large Desktop (≥1536px)
- Maximum content width
- Optimal spacing
- All features visible

### Desktop (≥1024px)
- Standard layout
- Multi-column grid
- Fixed sidebars

### Tablet (768px - 1023px)
- Collapsible sidebar
- Wrapped KPI cards
- Adjusted spacing

### Mobile (< 768px)
- Stacked layout
- Drawer filters
- Full-width components
- Scrollable tables

## 🎨 Design Principles

### Clarity
- Clear visual hierarchy
- Obvious interactive elements
- Readable typography
- Sufficient contrast

### Consistency
- Uniform spacing
- Consistent colors
- Standard patterns
- Predictable behavior

### Efficiency
- Quick data scanning
- Minimal clicks
- Fast loading
- Smooth interactions

### Professionalism
- Enterprise-grade design
- Polished appearance
- Attention to detail
- Brand consistency

## 🔍 Visual Details

### Micro-interactions
- Button press effects
- Checkbox toggles
- Dropdown animations
- Table row highlights

### Feedback
- Loading indicators
- Success states
- Error messages
- Empty states

### Polish
- Smooth transitions
- Subtle shadows
- Rounded corners
- Consistent spacing

---

**Design System Version**: 1.0.0
**Last Updated**: February 4, 2026
**Status**: Production Ready
