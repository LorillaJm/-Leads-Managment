# 🚀 Quick Start Guide

## Servers Running

✅ **Frontend**: http://localhost:5174  
✅ **Backend**: http://localhost:3001  
✅ **Health Check**: http://localhost:3001/api/v1/health

## Demo Accounts

### Management Account (Full Access)
- **Email**: manager@leadflow.com
- **Password**: password123
- **Access**: All leads, all analytics, rankings, full dashboard

### Sales Consultant Accounts (Limited Access)
- **Alice**: alice@leadflow.com / password123
- **Bob**: bob@leadflow.com / password123
- **Access**: Only their own leads, personal performance

## 🎯 What to Test

### 1. Login & Authentication
1. Go to http://localhost:5174
2. Login with manager@leadflow.com / password123
3. Verify you're redirected to Dashboard
4. Check user menu in top right

### 2. Dashboard (Phase 6)
1. View 4 KPI cards at top
2. Try date range filters
3. Scroll through 5 charts:
   - Leads by Status
   - Leads by Source
   - Interested Models
   - Preferred Colors
   - Conversion Funnel
4. Verify all charts render correctly

### 3. Performance (Phase 7 & 8)
1. Click "Performance" in sidebar
2. Watch entrance animations ✨
3. Try period selector (Week, Month, Year)
4. View "Performance Trends" line chart
5. Scroll to "Sales Consultant Rankings" table
6. Watch row animations

### 4. Leads Management (Phase 3)
1. Click "Leads" in sidebar
2. Click "New Lead" button
3. Fill out form and submit
4. Use search bar to find leads
5. Try status filter dropdown
6. Click eye icon to view lead details

### 5. Lead Details & Activities (Phase 4)
1. Open any lead
2. View activity timeline
3. Click "Add Activity" button
4. Try different activity types:
   - Test Drive
   - Reservation
   - Bank Application
   - Closed Deal
5. Watch status update automatically

### 6. Closed Deals (Phase 5)
1. Click "Closed Deals" in sidebar
2. View table of completed sales
3. Try search functionality
4. Click "Export CSV" button
5. Verify CSV downloads

### 7. Test RBAC
1. Logout (user menu → Logout)
2. Login as alice@leadflow.com / password123
3. Go to Dashboard - see only Alice's data
4. Go to Performance - NO rankings table (SC only)
5. Go to Leads - see only Alice's leads
6. Try to view Bob's lead - should fail

### 8. UI Polish (Phase 8)
1. Refresh any page
2. Watch skeleton loaders appear
3. Observe smooth fade-in animations
4. Hover over KPI cards (shadow effect)
5. Watch charts animate in
6. Check responsive design (resize browser)

## 🎨 Features to Showcase

### Animations (Framer Motion)
- Page headers fade in from top
- Cards scale and fade in with stagger
- Table rows slide in one by one
- Progress bars animate width
- Hover effects on cards

### Skeleton Loaders
- KPI cards show 3 skeleton elements
- Charts show full-height skeletons
- Tables show row skeletons
- Smooth transition to real content

### Charts (Recharts)
- Interactive tooltips on hover
- Color-coded data
- Responsive sizing
- Multiple chart types
- Multi-axis line charts

### Glass Morphism
- Semi-transparent cards
- Backdrop blur effect
- Subtle borders
- Premium feel

## 📊 Sample Data

The database is seeded with:
- **3 Users**: 1 Manager, 2 Sales Consultants
- **5 Leads**: Various statuses, sources, models
- **2 Closed Deals**: $45,000 and $52,000
- **Multiple Activities**: Test drives, reservations, etc.

## 🐛 Troubleshooting

### Charts not showing
- Refresh the page
- Check browser console for errors
- Verify Recharts is installed

### No data in tables
- Run seed script: `npm run api:seed`
- Check API responses in Network tab

### Animations not working
- Verify Framer Motion is installed
- Check browser supports CSS transforms
- Try hard refresh (Ctrl+Shift+R)

### Login fails
- Check API server is running (port 3001)
- Verify credentials are correct
- Check browser console for errors

## 🎯 Key Highlights

### Phase 1-4 (Foundation)
- ✅ Complete authentication system
- ✅ Lead CRUD with TanStack Table
- ✅ Activity tracking with timeline
- ✅ Automatic status updates

### Phase 5-6 (Analytics)
- ✅ Closed deals management
- ✅ CSV export functionality
- ✅ Dashboard with 5 chart types
- ✅ KPIs and date filtering

### Phase 7-8 (Polish)
- ✅ Performance trends line chart
- ✅ Skeleton loaders everywhere
- ✅ Framer Motion animations
- ✅ Micro-interactions
- ✅ Apple-inspired design

## 📱 Responsive Testing

Test on different screen sizes:
- **Desktop**: 1920x1080 (full layout)
- **Laptop**: 1366x768 (3-column grid)
- **Tablet**: 768x1024 (2-column grid)
- **Mobile**: 375x667 (1-column stack)

## 🎊 Success Criteria

You should see:
- ✅ Smooth page transitions
- ✅ Animated card entrances
- ✅ Skeleton loaders before content
- ✅ Interactive charts with tooltips
- ✅ Hover effects on cards
- ✅ Glass morphism design
- ✅ Responsive layouts
- ✅ RBAC working correctly
- ✅ All CRUD operations functional
- ✅ CSV export working

## 🚀 Next Steps

1. **Test all features** using this guide
2. **Review documentation** in other .md files
3. **Customize** for your business needs
4. **Deploy** to production (see Phase 10 docs)

## 📞 Need Help?

Check these files:
- `PROJECT_COMPLETE.md` - Full project overview
- `PHASE7_8_COMPLETE.md` - Latest features
- `VERIFICATION_GUIDE.md` - Detailed testing
- `CURRENT_STATUS.md` - Project status

---

**Enjoy your production-ready Lead Management System!** 🎉
