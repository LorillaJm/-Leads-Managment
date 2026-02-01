# Troubleshooting Guide

Common issues and their solutions for the LeadFlow UI.

## Runtime Errors

### "Cannot read properties of undefined (reading 'toLowerCase')"

**Cause**: Trying to call methods on undefined or null values, typically when filtering data.

**Solution**: Always use optional chaining (`?.`) when accessing properties that might be undefined:

```tsx
// ❌ Bad - Will crash if companyName is undefined
lead.companyName.toLowerCase()

// ✅ Good - Safe with optional chaining
lead.companyName?.toLowerCase()
```

**Fixed in**: `src/pages/Leads.tsx` - All filter operations now use optional chaining.

### "Cannot read properties of undefined (reading 'map')"

**Cause**: Trying to map over data that hasn't loaded yet or is undefined.

**Solution**: Always provide a fallback empty array:

```tsx
// ❌ Bad
const items = data?.items
items.map(item => ...)

// ✅ Good
const items = data?.items || []
items.map(item => ...)
```

### Error Boundary

The app now includes a global error boundary that catches unhandled errors and displays a friendly error screen with options to:
- Go to Dashboard
- Reload Page

**Location**: `src/components/ErrorBoundary.tsx`

## Build Errors

### "require is not defined"

**Cause**: Using CommonJS `require()` in ES modules.

**Solution**: Use ES6 import syntax:

```js
// ❌ Bad
plugins: [require('tailwindcss-animate')]

// ✅ Good
import tailwindcssAnimate from 'tailwindcss-animate'
plugins: [tailwindcssAnimate]

// Or simply remove if not needed
plugins: []
```

### TypeScript Errors

#### "Property does not exist on type '{}'"

**Cause**: TypeScript doesn't know the shape of API responses.

**Solution**: Use type assertions:

```tsx
// ❌ Bad
const leads = data?.leads

// ✅ Good
const leads = (data as any)?.data?.leads || []
```

#### "Unused variable"

**Cause**: Importing but not using a variable.

**Solution**: Remove unused imports or use the variable.

### Vite/Build Issues

#### Clear cache and rebuild

```bash
# Remove build artifacts
rm -rf dist node_modules/.vite

# Reinstall dependencies
npm install

# Rebuild
npm run build
```

## Data Loading Issues

### Empty Data on Page Load

**Symptoms**: Pages show empty states even when data exists.

**Causes**:
1. API endpoint not returning data in expected format
2. Incorrect data path in component
3. Authentication token missing

**Solutions**:

1. **Check API response format**:
```tsx
// Log the response to see structure
const { data } = useQuery({
  queryKey: ['leads'],
  queryFn: async () => {
    const result = await api.getLeads()
    console.log('API Response:', result)
    return result
  }
})
```

2. **Verify data path**:
```tsx
// Adjust based on actual API response structure
const leadsArray = (leads as any)?.data?.leads || []
// or
const leadsArray = (leads as any)?.leads || []
// or
const leadsArray = leads || []
```

3. **Check authentication**:
```tsx
// Verify token is set
console.log('Token:', localStorage.getItem('accessToken'))
```

### Loading State Never Ends

**Cause**: API request failing silently.

**Solution**: Add error handling:

```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ['leads'],
  queryFn: api.getLeads,
})

if (error) {
  console.error('Error loading leads:', error)
  return <div>Error: {error.message}</div>
}
```

## Styling Issues

### Tailwind Classes Not Working

**Causes**:
1. Class name typo
2. Content path not configured
3. Tailwind not processing file

**Solutions**:

1. **Check content paths in `tailwind.config.js`**:
```js
content: [
  './src/**/*.{ts,tsx}',
  './index.html',
]
```

2. **Verify Tailwind is imported**:
```tsx
// In main.tsx or App.tsx
import './index.css'
```

3. **Check for typos**:
```tsx
// ❌ Wrong
className="flex-center"

// ✅ Correct
className="flex items-center justify-center"
```

### Glass Effect Not Visible

**Cause**: Browser doesn't support `backdrop-filter`.

**Solution**: Add fallback in CSS:

```css
@supports not (backdrop-filter: blur(20px)) {
  .glass {
    background: hsl(var(--card));
  }
}
```

### Animations Not Working

**Causes**:
1. Framer Motion not installed
2. Animation props incorrect
3. Component not wrapped in motion element

**Solutions**:

1. **Install Framer Motion**:
```bash
npm install framer-motion
```

2. **Use correct syntax**:
```tsx
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
>
  Content
</motion.div>
```

## Responsive Design Issues

### Horizontal Scrolling on Mobile

**Causes**:
1. Fixed width elements
2. Large padding/margins
3. Overflow not hidden

**Solutions**:

1. **Use responsive widths**:
```tsx
// ❌ Bad
<div className="w-[1200px]">

// ✅ Good
<div className="w-full max-w-7xl">
```

2. **Adjust padding on mobile**:
```tsx
<div className="px-4 lg:px-8">
```

3. **Hide overflow**:
```tsx
<div className="overflow-x-hidden">
```

### Bottom Navigation Not Showing

**Cause**: Hidden on desktop by default.

**Solution**: Check viewport width - bottom nav only shows on mobile (<1024px).

```tsx
// In MobileBottomNav.tsx
className="fixed bottom-0 ... lg:hidden"
```

## Performance Issues

### Slow Page Load

**Solutions**:

1. **Lazy load routes**:
```tsx
const Dashboard = lazy(() => import('./pages/Dashboard'))
```

2. **Optimize images**:
```tsx
<img loading="lazy" src="..." />
```

3. **Debounce search**:
```tsx
const debouncedSearch = useMemo(
  () => debounce((value) => setSearchQuery(value), 300),
  []
)
```

### Animations Janky

**Solutions**:

1. **Use transform/opacity only**:
```tsx
// ✅ Good - GPU accelerated
initial={{ opacity: 0, y: 20 }}

// ❌ Avoid - Causes reflow
initial={{ height: 0, marginTop: 20 }}
```

2. **Reduce animation complexity**:
```tsx
// Simpler animations perform better
transition={{ duration: 0.2 }}
```

## API Issues

### CORS Errors

**Cause**: API server not configured for CORS.

**Solution**: Configure API server or use proxy in `vite.config.ts`:

```ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  }
})
```

### 401 Unauthorized

**Causes**:
1. Token expired
2. Token not sent
3. Invalid token

**Solutions**:

1. **Check token**:
```tsx
console.log('Token:', localStorage.getItem('accessToken'))
```

2. **Refresh token**:
```tsx
const { refreshAuth } = useAuth()
await refreshAuth()
```

3. **Re-login**:
```tsx
const { logout } = useAuth()
await logout()
navigate('/login')
```

## Development Server Issues

### Port Already in Use

**Solution**:
```bash
# Kill process on port 5173
npx kill-port 5173

# Or use different port
npm run dev -- --port 3000
```

### Hot Reload Not Working

**Solutions**:

1. **Restart dev server**:
```bash
# Stop server (Ctrl+C)
npm run dev
```

2. **Clear Vite cache**:
```bash
rm -rf node_modules/.vite
npm run dev
```

## Getting Help

If you encounter an issue not covered here:

1. **Check browser console** for error messages
2. **Check network tab** for failed API requests
3. **Review component source code** in `/src/components`
4. **Check documentation**:
   - DESIGN_SYSTEM.md
   - IMPLEMENTATION_GUIDE.md
   - QUICK_START.md

## Common Fixes Checklist

When something goes wrong, try these in order:

- [ ] Check browser console for errors
- [ ] Verify data is loading (check Network tab)
- [ ] Clear browser cache
- [ ] Restart development server
- [ ] Clear Vite cache (`rm -rf node_modules/.vite`)
- [ ] Reinstall dependencies (`rm -rf node_modules && npm install`)
- [ ] Check for TypeScript errors (`npm run build`)
- [ ] Verify environment variables
- [ ] Check API server is running
- [ ] Review recent code changes

---

**Still stuck?** Review the error message carefully - it usually points to the exact line and issue.
