# Performance & Ranking System - Quick Reference

## 🚀 Quick Start

### Access the Performance Page
```
URL: http://localhost:5173/performance
Route: /performance
Component: apps/web/src/pages/Performance.tsx
```

### API Endpoints
```typescript
// Get performance metrics
GET /api/v1/analytics/performance?period=week|month|year

// Get performance trends
GET /api/v1/analytics/trends?period=week|month|year

// Get rankings (Management only)
GET /api/v1/analytics/rankings?compare=true|false
```

## 📦 Component Usage

### PerformanceChart
```tsx
import { PerformanceChart } from '@/components/performance/PerformanceChart'

<PerformanceChart 
  data={trends} 
  period="month" 
/>
```

### RankingTable
```tsx
import { RankingTable } from '@/components/performance/RankingTable'

<RankingTable 
  data={rankings} 
  compareMode={true} 
/>
```

## 🎨 Design Tokens

### Colors
```css
/* Leads */
--color-leads: #3b82f6 (blue-500)

/* Conversions */
--color-conversions: #10b981 (emerald-500)

/* Revenue */
--color-revenue: #8b5cf6 (purple-500)

/* Rankings */
--color-gold: #f59e0b (amber-500)
--color-silver: #94a3b8 (slate-400)
--color-bronze: #92400e (amber-700)
```

### Gradients
```css
/* KPI Card Backgrounds */
from-blue-500/10 to-blue-600/5
from-emerald-500/10 to-emerald-600/5
from-purple-500/10 to-purple-600/5
from-amber-500/10 to-amber-600/5
```

## 🔐 Role-Based Access

### Sales Consultant
```typescript
// Can access
- Performance metrics (own data)
- Performance trends (own data)
- Quick insights

// Cannot access
- Rankings page
- Other consultants' data
```

### Management
```typescript
// Can access
- All performance metrics
- Team-wide trends
- Rankings page
- Comparison mode
- All consultants' data
```

## 📊 Data Structures

### Performance Metrics
```typescript
interface PerformanceMetrics {
  period: 'week' | 'month' | 'year'
  leadsCreated: number
  leadsConverted: number
  conversionRate: number
  activitiesLogged: number
}
```

### Trend Data
```typescript
interface TrendData {
  date: string
  leads: number
  conversions: number
  revenue: number
}
```

### Ranking Data
```typescript
interface RankingData {
  consultant: {
    id: string
    name: string
    email: string
  }
  metrics: {
    totalLeads: number
    closedDeals: number
    conversionRate: number
    totalRevenue: number
  }
  previousMetrics?: {
    totalLeads: number
    closedDeals: number
    conversionRate: number
    totalRevenue: number
  }
}
```

## 🎯 Common Tasks

### Add New Metric to KPI Cards
```tsx
// In Performance.tsx
<StatCard
  title="New Metric"
  value={metrics.newMetric || 0}
  icon={YourIcon}
  delay={0.4}
  className="bg-gradient-to-br from-color/10 to-color/5 border-color/20"
/>
```

### Add New Column to Rankings
```tsx
// In RankingTable.tsx
columnHelper.accessor('metrics.newMetric', {
  header: 'New Metric',
  cell: (info) => (
    <div>
      <p className="font-semibold">{info.getValue()}</p>
    </div>
  ),
})
```

### Change Chart Colors
```tsx
// In PerformanceChart.tsx
<Line
  type="monotone"
  dataKey="yourData"
  stroke="#yourColor"
  strokeWidth={2}
  dot={{ fill: '#yourColor', strokeWidth: 2, r: 4 }}
  name="Your Data"
/>
```

## 🐛 Debugging

### Check API Response
```typescript
// In browser console
const response = await fetch('http://localhost:3001/api/v1/analytics/performance?period=month', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  }
})
const data = await response.json()
console.log(data)
```

### Verify Role-Based Access
```typescript
// In AuthContext
const { user } = useAuth()
console.log('User role:', user?.role)
console.log('Is Management:', user?.role === 'MANAGEMENT')
```

### Check Query Cache
```typescript
// In React Query DevTools
// Press Ctrl+Shift+D to open DevTools
// Check queries: performance-metrics, performance-trends, sales-rankings
```

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 767px) {
  /* Single column layout */
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) {
  /* 2-column grid */
}

/* Desktop */
@media (min-width: 1024px) {
  /* 4-column grid */
}
```

## ⚡ Performance Tips

### Optimize Chart Rendering
```tsx
// Memoize chart data
const chartData = useMemo(() => trends, [trends])

// Use ResponsiveContainer
<ResponsiveContainer width="100%" height="100%">
  <LineChart data={chartData}>
    {/* ... */}
  </LineChart>
</ResponsiveContainer>
```

### Optimize Table Sorting
```tsx
// Use TanStack Table's built-in sorting
const [sorting, setSorting] = useState<SortingState>([])

const table = useReactTable({
  data,
  columns,
  state: { sorting },
  onSortingChange: setSorting,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
})
```

## 🧪 Testing

### Test API Endpoints
```bash
# Performance metrics
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3001/api/v1/analytics/performance?period=month

# Rankings
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3001/api/v1/analytics/rankings?compare=true
```

### Test Components
```tsx
// Test PerformanceChart
import { render } from '@testing-library/react'
import { PerformanceChart } from './PerformanceChart'

test('renders chart with data', () => {
  const data = [
    { date: 'Week 1', leads: 10, conversions: 2, revenue: 5000 }
  ]
  render(<PerformanceChart data={data} period="week" />)
  // Add assertions
})
```

## 📚 Related Files

```
Backend:
- apps/api/src/routes/analytics.ts
- apps/api/src/controllers/analyticsController.ts
- apps/api/src/services/analyticsService.ts

Frontend:
- apps/web/src/pages/Performance.tsx
- apps/web/src/components/performance/PerformanceChart.tsx
- apps/web/src/components/performance/RankingTable.tsx
- apps/web/src/lib/api.ts

UI Components:
- apps/web/src/components/ui/tabs.tsx
- apps/web/src/components/ui/badge.tsx
- apps/web/src/components/ui/select.tsx
- apps/web/src/components/ui/stat-card.tsx
```

## 🔗 Useful Links

- [Recharts Documentation](https://recharts.org/)
- [TanStack Table Documentation](https://tanstack.com/table/latest)
- [Radix UI Documentation](https://www.radix-ui.com/)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## 💡 Pro Tips

1. **Use React Query DevTools** for debugging API calls
2. **Enable Framer Motion DevTools** to debug animations
3. **Use browser DevTools** to inspect responsive breakpoints
4. **Check Network tab** for API response times
5. **Use Lighthouse** to audit performance
6. **Test with real data** for accurate performance metrics
7. **Clear cache** when testing data updates
8. **Use TypeScript** for type safety
9. **Follow naming conventions** for consistency
10. **Document changes** in code comments

## 🆘 Common Errors

### "Rankings not showing"
```typescript
// Check user role
if (user?.role !== 'MANAGEMENT') {
  // Rankings section won't render
}
```

### "Chart not rendering"
```typescript
// Check data format
const validData = [
  { date: 'Week 1', leads: 10, conversions: 2, revenue: 5000 }
]
// Not: { week: 'Week 1', ... }
```

### "API 401 Unauthorized"
```typescript
// Check token
const token = localStorage.getItem('accessToken')
if (!token) {
  // Redirect to login
}
```

## 📞 Support

For issues or questions:
1. Check this quick reference
2. Review full documentation in `documentation/PERFORMANCE_RANKING_GUIDE.md`
3. Check demo script in `documentation/PERFORMANCE_DEMO.md`
4. Contact the development team

---

**Last Updated**: February 1, 2026
**Version**: 1.0.0
