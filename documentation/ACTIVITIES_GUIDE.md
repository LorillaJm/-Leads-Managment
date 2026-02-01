# Activities & Conversion Flow - Complete Guide

## 🎯 Overview

The Activities & Conversion Flow feature enables tracking a lead's journey through the sales funnel, from initial test drive to closed deal. Built with Apple-inspired design and smooth animations.

---

## ✅ Features Implemented

### 1. Lead Details Page with Timeline

**Location:** `apps/web/src/pages/LeadDetails.tsx`

**Features:**
- ✅ **Lead Summary Card**
  - Contact information (email, phone)
  - Vehicle preferences (model, color)
  - Source information
  - Assigned sales consultant
  - Status badge with color coding
  - Creation and update timestamps
  - Remarks section

- ✅ **Activity Timeline**
  - Visual timeline with icons
  - Chronological order (most recent first)
  - Activity type indicators
  - Scheduled vs completed dates
  - Activity-specific details
  - Notes for each activity
  - Smooth animations on load

- ✅ **Conversion Progress Tracker**
  - 4-step progress indicator
  - Visual completion status
  - Step numbering
  - Green dot for completed steps

- ✅ **Quick Actions Sidebar**
  - Send Email
  - Make Call
  - Schedule Follow-up

### 2. Activity Timeline Component

**Location:** `apps/web/src/components/activities/ActivityTimeline.tsx`

**Features:**
- ✅ **Visual Timeline**
  - Vertical timeline line
  - Color-coded activity icons
  - Glass morphism cards
  - Staggered animations

- ✅ **Activity Types**
  - **Test Drive** (Blue) - Car icon
  - **Reservation** (Purple) - FileText icon
  - **Bank Application** (Orange) - Building icon
  - **Closed Deal** (Green) - CheckCircle icon

- ✅ **Activity Details Display**
  - Activity type label
  - Scheduled/Completed date
  - Status badge
  - Notes
  - Bank name (for bank applications)
  - Chassis number, VSI number, Date released (for closed deals)
  - Creation timestamp

- ✅ **Empty State**
  - Helpful message when no activities
  - Clock icon
  - Call-to-action text

### 3. Add Activity Modal

**Location:** `apps/web/src/components/activities/AddActivityModal.tsx`

**Features:**
- ✅ **Activity Type Selection**
  - 4 activity types with descriptions
  - Toggle-style selection
  - Visual feedback

- ✅ **Date Fields**
  - Scheduled Date (optional)
  - Completed Date (optional)
  - Calendar picker with popover

- ✅ **Conditional Fields**
  
  **For Bank Application:**
  - Bank name selection (10 banks)
  - Toggle-style bank selector
  
  **For Closed Deal:**
  - Chassis Number (required)
  - VSI Number (required)
  - Date Released (required)
  - Monospace font for numbers

- ✅ **Notes Field**
  - Optional textarea
  - Multi-line support

- ✅ **Form Validation**
  - Zod schema with discriminated unions
  - Conditional validation based on activity type
  - Real-time error messages
  - Required field validation

- ✅ **Auto Status Update**
  - Lead status updates automatically based on activity
  - Handled by backend API

---

## 🎨 Design System

### Activity Colors

```typescript
TEST_DRIVE: Blue (#3B82F6)
RESERVATION: Purple (#A855F7)
BANK_APPLICATION: Orange (#F97316)
CLOSED_DEAL: Green (#22C55E)
```

### Timeline Design

- **Timeline Line:** Vertical, 2px, border color
- **Activity Icons:** 48px circles with 2px border
- **Cards:** Glass morphism with rounded-xl
- **Spacing:** 24px between activities

### Animations

- **Timeline Items:** Slide in from left with stagger
- **Modal:** Zoom in with fade
- **Buttons:** Press effect (scale 0.98)

---

## 🛠️ Technology Stack

### Core
- **React Hook Form** - Form management
- **Zod** - Schema validation with discriminated unions
- **TanStack Query** - Data fetching and cache invalidation
- **Framer Motion** - Smooth animations
- **date-fns** - Date formatting

### UI Components
- Dialog (Modal)
- Calendar
- Popover
- Form components
- Badge
- Button

---

## 📁 File Structure

```
apps/web/src/
├── components/
│   └── activities/
│       ├── ActivityTimeline.tsx      # Timeline display
│       └── AddActivityModal.tsx      # Add activity form
└── pages/
    └── LeadDetails.tsx               # Updated with timeline
```

---

## 🔄 Data Flow

### Fetching Activities

```typescript
// Query activities for a lead
const { data: activitiesResponse } = useQuery({
  queryKey: ['activities', leadId],
  queryFn: () => api.getActivitiesByLeadId(leadId),
})
```

### Adding Activity

```typescript
// Mutation with cache invalidation
const createActivityMutation = useMutation({
  mutationFn: (data) => api.createActivity({ ...data, leadId }),
  onSuccess: () => {
    // Invalidate queries to refetch data
    queryClient.invalidateQueries({ queryKey: ['lead', leadId] })
    queryClient.invalidateQueries({ queryKey: ['activities', leadId] })
  },
})
```

---

## 📋 Activity Types & Fields

### 1. Test Drive

**Required Fields:**
- Activity type
- Date (scheduled or completed)

**Optional Fields:**
- Notes

**Example:**
```json
{
  "type": "TEST_DRIVE",
  "scheduledDate": "2024-02-15T10:00:00Z",
  "completedDate": "2024-02-15T11:30:00Z",
  "notes": "Customer loved the RAV4, interested in hybrid model"
}
```

### 2. Reservation

**Required Fields:**
- Activity type
- Date (scheduled or completed)

**Optional Fields:**
- Notes

**Example:**
```json
{
  "type": "RESERVATION",
  "completedDate": "2024-02-16T14:00:00Z",
  "notes": "Reservation fee paid, waiting for unit allocation"
}
```

### 3. Bank Application

**Required Fields:**
- Activity type
- Bank name
- Date (scheduled or completed)

**Optional Fields:**
- Notes

**Banks Available:**
- BDO
- BPI
- Metrobank
- Security Bank
- UnionBank
- RCBC
- PNB
- Chinabank
- EastWest Bank
- Other

**Example:**
```json
{
  "type": "BANK_APPLICATION",
  "bankName": "BPI",
  "completedDate": "2024-02-17T09:00:00Z",
  "notes": "Application submitted, waiting for approval"
}
```

### 4. Closed Deal

**Required Fields:**
- Activity type
- Chassis number
- VSI number
- Date released
- Date (scheduled or completed)

**Optional Fields:**
- Notes

**Example:**
```json
{
  "type": "CLOSED_DEAL",
  "chassisNumber": "MHFXW1234567890",
  "vsiNumber": "VSI-2024-001",
  "dateReleased": "2024-02-20T00:00:00Z",
  "completedDate": "2024-02-20T15:00:00Z",
  "notes": "Vehicle released to customer, all documents signed"
}
```

---

## 🎯 Usage Guide

### Viewing Activities

1. Navigate to lead details page (`/leads/:id`)
2. Scroll to "Activity Timeline" section
3. View all activities in chronological order
4. Check conversion progress in sidebar

### Adding an Activity

1. Click "Add Activity" button
2. Select activity type
3. Fill in required fields:
   - **All types:** Choose dates
   - **Bank Application:** Select bank
   - **Closed Deal:** Enter chassis, VSI, release date
4. Add optional notes
5. Click "Add Activity"
6. Success toast appears
7. Timeline updates automatically

### Activity Type Selection

**Test Drive:**
- Use when customer schedules or completes a test drive
- Track test drive dates
- Add notes about customer feedback

**Reservation:**
- Use when customer reserves a vehicle
- Track reservation date
- Note reservation details

**Bank Application:**
- Use when financing application is submitted
- Select the bank
- Track application status in notes

**Closed Deal:**
- Use when sale is completed
- Enter vehicle identification numbers
- Record release date
- Mark deal as closed

---

## 🔐 Validation Rules

### Conditional Validation

The form uses Zod's discriminated unions for type-safe conditional validation:

```typescript
// Base schema for all activities
const baseActivitySchema = z.object({
  type: z.enum(['TEST_DRIVE', 'RESERVATION', 'BANK_APPLICATION', 'CLOSED_DEAL']),
  scheduledDate: z.date().optional(),
  completedDate: z.date().optional(),
  notes: z.string().optional(),
})

// Bank Application requires bank name
const bankApplicationSchema = baseActivitySchema.extend({
  type: z.literal('BANK_APPLICATION'),
  bankName: z.string().min(1, 'Bank name is required'),
})

// Closed Deal requires vehicle details
const closedDealSchema = baseActivitySchema.extend({
  type: z.literal('CLOSED_DEAL'),
  chassisNumber: z.string().min(1, 'Chassis number is required'),
  vsiNumber: z.string().min(1, 'VSI number is required'),
  dateReleased: z.date({ required_error: 'Date released is required' }),
})
```

### Error Messages

- "Activity type is required"
- "Bank name is required for bank applications"
- "Chassis number is required for closed deals"
- "VSI number is required for closed deals"
- "Date released is required for closed deals"

---

## 🎨 UI Components

### Timeline Item Structure

```tsx
<div className="relative pl-16">
  {/* Icon Circle */}
  <div className="absolute left-0 h-12 w-12 rounded-xl border-2">
    <Icon />
  </div>
  
  {/* Content Card */}
  <div className="glass-card p-4 rounded-xl">
    {/* Header */}
    <h4>Activity Type</h4>
    <Badge>Status</Badge>
    
    {/* Details */}
    <div>Notes, dates, etc.</div>
    
    {/* Timestamp */}
    <p>Added timestamp</p>
  </div>
</div>
```

### Modal Structure

```tsx
<Dialog>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Add Activity</DialogTitle>
      <DialogDescription>Track progress</DialogDescription>
    </DialogHeader>
    
    <Form>
      {/* Activity Type Selection */}
      {/* Date Fields */}
      {/* Conditional Fields */}
      {/* Notes */}
      {/* Submit Buttons */}
    </Form>
  </DialogContent>
</Dialog>
```

---

## 🚀 Performance

### Optimizations

1. **Query Invalidation**
   - Only invalidates affected queries
   - Automatic refetch after mutations

2. **Conditional Rendering**
   - Fields only render when needed
   - Reduces DOM complexity

3. **Memoization**
   - Activity sorting memoized
   - Icon components cached

4. **Animations**
   - GPU-accelerated transforms
   - Staggered for smooth appearance

---

## ♿ Accessibility

- ✅ Keyboard navigation
- ✅ ARIA labels on all interactive elements
- ✅ Focus indicators
- ✅ Screen reader friendly
- ✅ Semantic HTML
- ✅ Color contrast (WCAG AA)

---

## 📱 Responsive Design

### Mobile (< 640px)
- Single column layout
- Full-width timeline
- Stacked form fields
- Touch-friendly buttons

### Tablet (640px - 1024px)
- Two-column grids
- Optimized spacing
- Side-by-side dates

### Desktop (> 1024px)
- Three-column layout
- Full timeline view
- Sidebar progress tracker

---

## 🔮 Auto Status Update

### Status Progression

When activities are added, the lead status automatically updates:

```
NEW → CONTACTED → QUALIFIED → TEST_DRIVE → 
RESERVATION → BANK_APPLICATION → CLOSED_DEAL
```

### Logic

- Adding "Test Drive" → Status becomes "TEST_DRIVE"
- Adding "Reservation" → Status becomes "RESERVATION"
- Adding "Bank Application" → Status becomes "BANK_APPLICATION"
- Adding "Closed Deal" → Status becomes "CLOSED_DEAL"

This is handled by the backend API automatically.

---

## 🎯 Best Practices

### When to Add Activities

1. **Test Drive**
   - Schedule: When appointment is made
   - Complete: After test drive is done

2. **Reservation**
   - Complete: When reservation fee is paid

3. **Bank Application**
   - Complete: When application is submitted
   - Always select the bank

4. **Closed Deal**
   - Complete: When vehicle is released
   - Enter all vehicle details accurately

### Notes Guidelines

- Be specific and detailed
- Include customer feedback
- Note any special requests
- Record important dates
- Mention follow-up actions

---

## 🐛 Troubleshooting

### Activities Not Showing

1. Check if lead ID is valid
2. Verify API endpoint is working
3. Check browser console for errors
4. Ensure activities query is enabled

### Form Validation Errors

1. Check all required fields are filled
2. Verify dates are selected
3. For Bank Application: Ensure bank is selected
4. For Closed Deal: Check all vehicle details

### Timeline Not Updating

1. Check query invalidation is working
2. Verify mutation success callback
3. Check TanStack Query DevTools
4. Refresh the page

---

## 📊 API Endpoints

### Get Activities
```
GET /api/v1/activities/lead/:leadId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "activities": [...]
  }
}
```

### Create Activity
```
POST /api/v1/activities
```

**Request Body:**
```json
{
  "leadId": "string",
  "type": "TEST_DRIVE | RESERVATION | BANK_APPLICATION | CLOSED_DEAL",
  "scheduledDate": "ISO date string (optional)",
  "completedDate": "ISO date string (optional)",
  "notes": "string (optional)",
  "bankName": "string (required for BANK_APPLICATION)",
  "chassisNumber": "string (required for CLOSED_DEAL)",
  "vsiNumber": "string (required for CLOSED_DEAL)",
  "dateReleased": "ISO date string (required for CLOSED_DEAL)"
}
```

---

## 🎉 Summary

### What Was Built

✅ **Activity Timeline**
- Visual timeline with icons
- Color-coded activities
- Detailed information display
- Empty state handling

✅ **Add Activity Modal**
- Type selection
- Conditional fields
- Form validation
- Success feedback

✅ **Conversion Progress**
- 4-step tracker
- Visual completion status
- Sidebar display

✅ **Auto Status Update**
- Automatic lead status progression
- Backend integration

### Key Features

- **Apple-inspired design** with glass morphism
- **Smooth animations** with Framer Motion
- **Type-safe validation** with Zod discriminated unions
- **Automatic cache invalidation** with TanStack Query
- **Responsive design** for all devices
- **Accessible** with WCAG AA compliance

### Files Created

1. `ActivityTimeline.tsx` - Timeline component
2. `AddActivityModal.tsx` - Add activity form
3. Updated `LeadDetails.tsx` - Integrated timeline

---

## 🚀 Next Steps

### Potential Enhancements

- [ ] Edit/Delete activities
- [ ] Activity filters
- [ ] Export timeline to PDF
- [ ] Activity reminders
- [ ] Bulk activity import
- [ ] Activity templates
- [ ] Email notifications
- [ ] Activity analytics

---

## 📞 Support

For issues or questions:
1. Check the console for errors
2. Review validation messages
3. Check API logs
4. Verify data structure

---

**Status: ✅ COMPLETE**

All activity and conversion flow features are production-ready with Apple-inspired design!
