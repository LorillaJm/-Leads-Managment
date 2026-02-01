# Lead Management System - Complete Guide

## Overview

A production-ready Lead Management System built with Apple-inspired UI design principles. Features include comprehensive lead tracking, advanced filtering, role-based access control, and a premium user experience.

## Features Implemented

### 1. Leads List Page (Tabular Tracker)

**Location:** `apps/web/src/pages/LeadsNew.tsx`

**Features:**
- ✅ **TanStack Table Integration**
  - Sortable columns (Date, Name, Model, Source)
  - Column filtering
  - Pagination (10 items per page)
  - Global search across all fields
  
- ✅ **Search & Filters**
  - Global search by name, contact, or email
  - Advanced filter drawer with:
    - Model filter
    - Color filter
    - Source filter
    - Active filter count badge
  
- ✅ **Apple-Inspired UI**
  - Glass morphism cards
  - Smooth animations with Framer Motion
  - Rounded corners (rounded-xl)
  - Subtle borders and shadows
  - Micro-interactions on hover
  - Press effects on buttons

- ✅ **Data Display**
  - Date with formatting (MMM dd, yyyy)
  - Name (First + Last)
  - Contact (Phone + Email)
  - Model
  - Color with visual indicator
  - Source badge
  - Status badge with color coding

### 2. New Lead Form

**Location:** `apps/web/src/components/leads/NewLeadSheet.tsx`

**Features:**
- ✅ **Form Fields**
  - Date inputted (Calendar picker)
  - First Name & Last Name
  - Contact Number & Email
  - Model selection (11 Toyota models)
  - Color selection (7 colors with visual swatches)
  - Source selection (Walk-in, Referral, Social Media, Display)
  - Remarks (Optional textarea)

- ✅ **Form Validation**
  - React Hook Form + Zod schema validation
  - Real-time error messages
  - Required field validation
  - Email format validation
  - Phone number length validation

- ✅ **UI/UX**
  - Sheet/Drawer component (slides from right)
  - Toggle-style buttons for model/color/source
  - Visual color swatches
  - Calendar popover for date selection
  - Success toast notification
  - Loading state during submission

### 3. Edit Lead Page

**Location:** `apps/web/src/components/leads/EditLeadSheet.tsx`

**Features:**
- ✅ **Edit Functionality**
  - Pre-populated form with existing lead data
  - Same validation as new lead form
  - Shows "last updated" timestamp
  
- ✅ **Role-Based Access Control (RBAC)**
  - Sales Consultants: Can only edit their own leads
  - Management: Can edit all leads
  - Permission denied message for unauthorized users

- ✅ **UI Features**
  - Sheet component for editing
  - Success toast on update
  - Error handling with toast notifications

### 4. Lead Details Page

**Location:** `apps/web/src/pages/LeadDetails.tsx`

**Features:**
- ✅ **Lead Information Display**
  - Full contact details
  - Model and color preferences
  - Source information
  - Assigned sales consultant
  - Status with color-coded badge
  - Creation and update timestamps
  - Remarks section

- ✅ **Quick Actions**
  - Edit button (opens edit sheet)
  - Send Email
  - Make Call
  - Schedule Follow-up

- ✅ **Apple-Inspired Design**
  - Glass card layout
  - Two-column responsive grid
  - Smooth animations
  - Icon-based information display

## Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TanStack Table v8** - Advanced table functionality
- **TanStack Query v5** - Data fetching and caching
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Framer Motion** - Animations
- **date-fns** - Date formatting
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible components

### UI Components (shadcn/ui)
- Button
- Input
- Select
- Badge
- Card
- Sheet (Drawer)
- Calendar
- Popover
- Toast
- Form
- Table
- Skeleton

## Apple-Inspired Design System

### Colors
- Clean white backgrounds (#FAFAFA)
- Subtle borders (rgba with low opacity)
- Primary blue accent (#007AFF)
- Status colors (success, warning, destructive)

### Typography
- SF Pro Display font family
- Font weights: 400 (regular), 600 (semibold)
- Tracking-tight for headings

### Spacing
- Generous whitespace
- Consistent padding (p-4, p-6)
- Gap spacing (gap-2, gap-4, gap-6)

### Borders & Radius
- Rounded corners: rounded-xl (1.25rem)
- Subtle borders: border-border/50
- Glass morphism: backdrop-blur-md

### Animations
- Smooth transitions (300ms ease)
- Micro-interactions on hover
- Press effects (scale-[0.98])
- Slide-in animations for lists
- Fade-in for page loads

## File Structure

```
apps/web/src/
├── components/
│   ├── leads/
│   │   ├── NewLeadSheet.tsx      # New lead form
│   │   └── EditLeadSheet.tsx     # Edit lead form
│   └── ui/
│       ├── button.tsx
│       ├── input.tsx
│       ├── sheet.tsx
│       ├── calendar.tsx
│       ├── toast.tsx
│       ├── toaster.tsx
│       ├── use-toast.ts
│       ├── form.tsx
│       ├── popover.tsx
│       └── ... (other components)
├── pages/
│   ├── LeadsNew.tsx              # Main leads list page
│   └── LeadDetails.tsx           # Lead details page
├── contexts/
│   └── AuthContext.tsx           # Authentication context
├── lib/
│   ├── api.ts                    # API client
│   └── utils.ts                  # Utility functions
└── App.tsx                       # Main app component
```

## API Integration

### Endpoints Used
- `GET /api/v1/leads` - Fetch all leads
- `GET /api/v1/leads/:id` - Fetch single lead
- `POST /api/v1/leads` - Create new lead
- `PUT /api/v1/leads/:id` - Update lead
- `GET /api/v1/users/sales-consultants` - Fetch sales consultants

### Data Flow
1. TanStack Query manages data fetching and caching
2. Mutations handle create/update operations
3. Automatic refetch on success
4. Toast notifications for user feedback

## Usage Guide

### Viewing Leads
1. Navigate to `/leads`
2. Use global search to find specific leads
3. Click filter button for advanced filtering
4. Click column headers to sort
5. Use pagination controls at bottom
6. Click any row to view details

### Creating a Lead
1. Click "New Lead" button
2. Fill in all required fields:
   - Date inputted
   - Name (first & last)
   - Contact (phone & email)
   - Select model from grid
   - Select color from swatches
   - Choose source
   - Add remarks (optional)
3. Click "Create Lead"
4. Success toast appears
5. Lead list refreshes automatically

### Editing a Lead
1. Navigate to lead details page
2. Click "Edit" button
3. Modify fields as needed
4. Click "Update Lead"
5. Changes saved with timestamp
6. Success toast appears

### Permissions
- **Sales Consultants**: Can edit only their assigned leads
- **Management**: Can edit all leads
- Unauthorized edit attempts show permission denied message

## Responsive Design

- **Mobile (< 640px)**
  - Single column layout
  - Stacked filters
  - Full-width buttons
  - Scrollable table

- **Tablet (640px - 1024px)**
  - Two-column grids
  - Side-by-side filters
  - Optimized spacing

- **Desktop (> 1024px)**
  - Three-column layouts
  - Full table view
  - Maximum whitespace
  - Optimal reading width

## Performance Optimizations

1. **TanStack Query Caching**
   - 5-minute stale time
   - Automatic background refetch
   - Optimistic updates

2. **Lazy Loading**
   - Pagination reduces initial load
   - Only visible data rendered

3. **Memoization**
   - useMemo for column definitions
   - Prevents unnecessary re-renders

4. **Debounced Search**
   - Reduces API calls during typing

## Accessibility

- Semantic HTML elements
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus indicators
- Screen reader friendly
- Color contrast compliance (WCAG AA)

## Future Enhancements

- [ ] Date range filtering
- [ ] Bulk actions (delete, assign)
- [ ] Export to CSV/Excel
- [ ] Lead import functionality
- [ ] Advanced analytics dashboard
- [ ] Email integration
- [ ] SMS notifications
- [ ] Activity timeline
- [ ] Lead scoring algorithm
- [ ] Kanban board view

## Development

### Running the App
```bash
# Install dependencies
npm install

# Start development server
npm run web:dev

# Build for production
npm run build
```

### Environment Variables
```env
VITE_API_URL=http://localhost:3001
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Proprietary - All rights reserved
