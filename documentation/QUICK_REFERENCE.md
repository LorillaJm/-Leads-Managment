# Lead Management System - Quick Reference

## 🚀 Quick Start

```bash
# Install
npm install

# Run API
npm run api:dev

# Run Web (separate terminal)
npm run web:dev

# Access
http://localhost:5173
```

## 🔑 Login

- **Management:** management@example.com / password123
- **Sales:** sales@example.com / password123

## 📋 Main Features

### Leads List (`/leads`)
- Search: Type in search box
- Filter: Click "Filters" button
- Sort: Click column headers
- View: Click any row
- New: Click "New Lead" button

### Lead Details (`/leads/:id`)
- Edit: Click "Edit" button
- Add Activity: Click "Add Activity" button
- View Timeline: Scroll to timeline section
- Check Progress: See sidebar

### Activities (4 Types)

1. **Test Drive** (Blue)
   - Schedule or complete test drives
   - Add notes about customer feedback

2. **Reservation** (Purple)
   - Record vehicle reservations
   - Track reservation details

3. **Bank Application** (Orange)
   - Submit financing applications
   - Select bank (10 options)
   - Track application status

4. **Closed Deal** (Green)
   - Complete the sale
   - Enter chassis & VSI numbers
   - Record release date

## 🎨 Design Elements

- **Glass Cards:** Backdrop blur effect
- **Rounded Corners:** 1.25rem radius
- **Colors:** Blue, Purple, Orange, Green
- **Animations:** 300ms smooth transitions
- **Icons:** Lucide React

## 📁 Key Files

```
apps/web/src/
├── pages/
│   ├── LeadsNew.tsx          # Leads list
│   └── LeadDetails.tsx       # Lead details + timeline
├── components/
│   ├── leads/
│   │   ├── NewLeadSheet.tsx  # Create form
│   │   └── EditLeadSheet.tsx # Edit form
│   └── activities/
│       ├── ActivityTimeline.tsx    # Timeline display
│       └── AddActivityModal.tsx    # Add activity form
```

## 🛠️ Tech Stack

- React 18 + TypeScript
- TanStack Table + Query
- React Hook Form + Zod
- Framer Motion
- Tailwind CSS + shadcn/ui

## 📚 Documentation

1. **LEAD_MANAGEMENT_GUIDE.md** - Lead features
2. **ACTIVITIES_GUIDE.md** - Activity features
3. **QUICK_START_LEADS.md** - Getting started
4. **DEMO_SCRIPT.md** - Demo guide (5 min)
5. **ACTIVITIES_DEMO.md** - Activities demo (3 min)
6. **VISUAL_SHOWCASE.md** - Design system

## 🎯 Common Tasks

### Create a Lead
1. Click "New Lead"
2. Fill form (all fields required except remarks)
3. Select model, color, source
4. Click "Create Lead"

### Add Test Drive
1. Open lead details
2. Click "Add Activity"
3. Select "Test Drive"
4. Pick date
5. Add notes
6. Submit

### Add Bank Application
1. Click "Add Activity"
2. Select "Bank Application"
3. Choose bank
4. Pick date
5. Submit

### Close a Deal
1. Click "Add Activity"
2. Select "Closed Deal"
3. Enter chassis number
4. Enter VSI number
5. Pick release date
6. Submit

## 🐛 Troubleshooting

### Port in Use
```bash
npx kill-port 5173
npx kill-port 3001
```

### Reset Database
```bash
npm run db:migrate -w apps/api
npm run db:seed -w apps/api
```

### Clear Cache
```bash
rm -rf node_modules
npm install
```

## ✅ Checklist

**Lead Management:**
- [x] View leads list
- [x] Search leads
- [x] Filter leads
- [x] Sort columns
- [x] Create lead
- [x] Edit lead
- [x] View details

**Activities:**
- [x] View timeline
- [x] Add test drive
- [x] Add reservation
- [x] Add bank app
- [x] Close deal
- [x] View progress

## 🎨 Color Reference

```
Primary: #007AFF (iOS Blue)
Test Drive: #3B82F6 (Blue)
Reservation: #A855F7 (Purple)
Bank App: #F97316 (Orange)
Closed Deal: #22C55E (Green)
Success: #34C759
Warning: #FF9500
Destructive: #FF3B30
```

## 📊 Status Flow

```
NEW → CONTACTED → QUALIFIED → TEST_DRIVE → 
RESERVATION → BANK_APPLICATION → CLOSED_DEAL
```

## 🎯 Permissions

**Sales Consultant:**
- View own leads
- Edit own leads
- Add activities to own leads

**Management:**
- View all leads
- Edit all leads
- Add activities to all leads

## 💡 Pro Tips

1. Use search before filtering
2. Add notes to all activities
3. Complete dates when done
4. Check conversion progress
5. Update lead info regularly

## 📞 Support

- Check console for errors
- Review documentation
- Verify API is running
- Check browser compatibility

---

**Status:** ✅ Production Ready
**Version:** 1.0.0
**Last Updated:** February 2026
