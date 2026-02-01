# Phase 5 & 6 Verification Guide

## ✅ Servers Running

- **Frontend**: http://localhost:5174
- **Backend**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/v1/health

## 🔐 Demo Accounts

### Management Account
- **Email**: manager@leadflow.com
- **Password**: password123
- **Access**: All leads, all deals, rankings, full analytics

### Sales Consultant Accounts
- **Alice**: alice@leadflow.com / password123
- **Bob**: bob@leadflow.com / password123
- **Access**: Only their own leads/deals, personal performance

## 📋 Step-by-Step Verification

### 1. Dashboard Page (Phase 6)

**Login as Manager** (manager@leadflow.com)

1. Navigate to **Dashboard** from sidebar
2. Verify you see:
   - ✅ 4 KPI cards at the top (Total Leads, Closed Deals, Total Revenue, Lost Leads)
   - ✅ Date range filter section with Start Date and End Date inputs
   - ✅ 5 charts:
     - Leads by Status (bar chart)
     - Leads by Source (pie chart)
     - Interested Models (horizontal bar chart)
     - Preferred Colors (pie chart)
     - Conversion Funnel (bar chart at bottom)

3. Test date filtering:
   - Set Start Date: 2024-01-01
   - Set End Date: 2024-12-31
   - Verify KPIs and charts update
   - Click "Clear Filters" button
   - Verify filters are cleared

**Login as Sales Consultant** (alice@leadflow.com)

1. Navigate to **Dashboard**
2. Verify you see only YOUR leads in the data
3. Numbers should be lower than manager's view

### 2. Performance Page (Phase 6)

**Login as Manager** (manager@leadflow.com)

1. Navigate to **Performance** from sidebar
2. Verify you see:
   - ✅ 4 metric cards (Leads Created, Leads Converted, Conversion Rate, Activities Logged)
   - ✅ Period selector buttons (Last Week, Last Month, Last Year)
   - ✅ **Sales Consultant Rankings table** (Management only!)
     - Trophy icons for top 3
     - Columns: Rank, Consultant, Total Leads, Closed Deals, Conversion Rate, Total Revenue
     - Progress bars for conversion rates

3. Test period selector:
   - Click "Last Week" - verify metrics update
   - Click "Last Month" - verify metrics update
   - Click "Last Year" - verify metrics update

**Login as Sales Consultant** (alice@leadflow.com)

1. Navigate to **Performance**
2. Verify you see:
   - ✅ 4 metric cards (your personal metrics)
   - ✅ Period selector
   - ✅ **Personal Performance Summary** section (instead of rankings)
     - 4 colored cards with your stats
   - ❌ NO Rankings table (this is Management only)

### 3. Closed Deals Page (Phase 5)

**Login as Manager** (manager@leadflow.com)

1. Navigate to **Closed Deals** from sidebar
2. Verify you see:
   - ✅ "Export CSV" button at top right
   - ✅ Search bar
   - ✅ Table with columns:
     - Customer (name + email)
     - Vehicle (model + color)
     - Chassis/VSI (numbers)
     - Released (date)
     - Sale Price (in green)
     - Consultant (name)
   - ✅ Pagination controls at bottom

3. Test search:
   - Type a customer name in search
   - Verify table filters

4. Test CSV export:
   - Click "Export CSV" button
   - Verify file downloads (closed-deals-[timestamp].csv)
   - Open CSV file
   - Verify data is formatted correctly

**Login as Sales Consultant** (alice@leadflow.com)

1. Navigate to **Closed Deals**
2. Verify you see only YOUR closed deals
3. Test search and export

### 4. API Endpoint Testing

Open a new terminal or use a tool like Postman/Insomnia:

```bash
# Get access token first (login)
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"manager@leadflow.com","password":"password123"}'

# Copy the accessToken from response, then test endpoints:

# Dashboard Stats
curl http://localhost:3001/api/v1/analytics/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"

# Dashboard Stats with date filter
curl "http://localhost:3001/api/v1/analytics/dashboard?startDate=2024-01-01&endDate=2024-12-31" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Conversion Funnel
curl http://localhost:3001/api/v1/analytics/funnel \
  -H "Authorization: Bearer YOUR_TOKEN"

# Performance Metrics
curl "http://localhost:3001/api/v1/analytics/performance?period=month" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Rankings (Management only)
curl http://localhost:3001/api/v1/analytics/rankings \
  -H "Authorization: Bearer YOUR_TOKEN"

# Closed Deals
curl http://localhost:3001/api/v1/closed-deals \
  -H "Authorization: Bearer YOUR_TOKEN"

# Closed Deals with search
curl "http://localhost:3001/api/v1/closed-deals?search=John&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🎯 Expected Results

### Dashboard
- **Manager**: Should see 5 total leads, 2 closed deals, conversion rate ~40%
- **Alice**: Should see only her leads (2-3 leads)
- **Bob**: Should see only his leads (2-3 leads)

### Performance
- **Manager**: Should see rankings table with Alice and Bob
- **Sales Consultants**: Should see personal summary cards only

### Closed Deals
- **Manager**: Should see 2 closed deals
- **Sales Consultants**: Should see only their own closed deals

## 🐛 Troubleshooting

### Charts not showing
- Check browser console for errors
- Verify Recharts is installed: `npm list recharts -w apps/web`
- Refresh the page

### No data in tables
- Verify database has seed data
- Run: `npm run api:seed` if needed
- Check API responses in Network tab

### RBAC not working
- Clear browser localStorage
- Logout and login again
- Verify JWT token is being sent in requests

### CSV export not working
- Check browser console for errors
- Verify API endpoint returns blob
- Check browser download settings

## ✨ Success Criteria

All of these should be ✅:

- [ ] Dashboard shows 4 KPI cards with real data
- [ ] Dashboard shows 5 different charts
- [ ] Date range filter works on Dashboard
- [ ] Performance shows 4 metric cards
- [ ] Performance period selector works
- [ ] Rankings table appears for Management only
- [ ] Personal summary appears for Sales Consultants only
- [ ] Closed Deals table displays correctly
- [ ] Search works on Closed Deals
- [ ] CSV export downloads file
- [ ] RBAC enforced (SC sees only their data)
- [ ] All pages are responsive
- [ ] Loading states appear while fetching
- [ ] Empty states show when no data
- [ ] No TypeScript errors in console
- [ ] No API errors in Network tab

## 📊 Sample Data

Current seed data includes:
- **3 Users**: 1 Manager, 2 Sales Consultants
- **5 Leads**: Various statuses, sources, models, colors
- **2 Closed Deals**: With sale prices ($45,000 and $52,000)
- **Multiple Activities**: Test drives, reservations, bank apps

## 🎨 UI Quality Check

Verify Apple-inspired design:
- [ ] Glass morphism cards (semi-transparent with blur)
- [ ] Rounded corners (rounded-xl, rounded-2xl)
- [ ] Zinc color palette
- [ ] Icon-enhanced KPI cards
- [ ] Smooth hover effects
- [ ] Proper spacing and whitespace
- [ ] Consistent typography
- [ ] Color-coded status indicators

## 🚀 Next Steps

After verification:
1. Test with more seed data if needed
2. Proceed to Phase 7 (Performance trends)
3. Or proceed to Phase 8 (UI Polish)

## 📝 Notes

- Frontend runs on port 5174 (not 5173 due to port conflict)
- Backend runs on port 3001
- SQLite database at `apps/api/prisma/dev.db`
- All passwords are `password123` for demo accounts
