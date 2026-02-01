# Quick Start - Lead Management System

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Servers

**Terminal 1 - API Server:**
```bash
npm run api:dev
```

**Terminal 2 - Web App:**
```bash
npm run web:dev
```

### 3. Access the Application
- Web App: http://localhost:5173
- API Server: http://localhost:3001

### 4. Login Credentials
Use the seeded user accounts:
- **Management:** management@example.com / password123
- **Sales Consultant:** sales@example.com / password123

## 📋 Features Overview

### Leads List Page
- **URL:** `/leads`
- **Features:**
  - Search leads by name, contact, or email
  - Filter by model, color, source
  - Sort columns (Date, Name, Model, Source)
  - Pagination (10 per page)
  - Click row to view details

### Create New Lead
1. Click "New Lead" button
2. Fill in the form:
   - Date inputted (calendar picker)
   - Name (first & last)
   - Contact (phone & email)
   - Select model (11 Toyota models)
   - Select color (7 options with swatches)
   - Choose source (Walk-in, Referral, Social Media, Display)
   - Add remarks (optional)
3. Click "Create Lead"

### Edit Lead
1. Go to lead details page
2. Click "Edit" button
3. Modify fields
4. Click "Update Lead"

**Permissions:**
- Sales Consultants: Can only edit their own leads
- Management: Can edit all leads

## 🎨 UI Features

### Apple-Inspired Design
- Clean, minimal interface
- Glass morphism effects
- Smooth animations
- Rounded corners (rounded-xl)
- Generous whitespace
- Subtle shadows and borders

### Interactive Elements
- Hover effects on all buttons
- Press effects (scale down on click)
- Slide-in animations for lists
- Toast notifications for actions
- Loading states during operations

## 🔧 Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + shadcn/ui
- **Tables:** TanStack Table v8
- **Data:** TanStack Query v5
- **Forms:** React Hook Form + Zod
- **Animations:** Framer Motion
- **Dates:** date-fns

## 📁 Key Files

```
apps/web/src/
├── pages/
│   ├── LeadsNew.tsx          # Main leads list with table
│   └── LeadDetails.tsx       # Lead details page
├── components/
│   └── leads/
│       ├── NewLeadSheet.tsx  # Create lead form
│       └── EditLeadSheet.tsx # Edit lead form
```

## 🎯 Common Tasks

### Search for a Lead
1. Type in the search box at the top
2. Search works across name, contact, and email

### Filter Leads
1. Click "Filters" button
2. Enter filter criteria
3. Click "Apply Filters"
4. Clear with "Clear All" button

### Sort Leads
1. Click any column header with sort icon
2. Click again to reverse sort order

### Navigate Pages
1. Use "Previous" and "Next" buttons at bottom
2. Shows current page range

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173 (web)
npx kill-port 5173

# Kill process on port 3001 (api)
npx kill-port 3001
```

### Database Issues
```bash
# Reset database
npm run db:migrate -w apps/api
npm run db:seed -w apps/api
```

### Clear Cache
```bash
# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📱 Responsive Design

- **Mobile:** Single column, stacked layout
- **Tablet:** Two columns, optimized spacing
- **Desktop:** Full layout with three columns

## ✨ Best Practices

1. **Always validate forms** - All fields have validation
2. **Check permissions** - Edit restrictions based on role
3. **Use search first** - Before filtering, try global search
4. **Watch for toasts** - Success/error messages appear top-right
5. **Save frequently** - Changes are saved immediately

## 🎓 Learning Resources

- [TanStack Table Docs](https://tanstack.com/table/latest)
- [React Hook Form](https://react-hook-form.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

## 📞 Support

For issues or questions:
1. Check the console for errors
2. Review the LEAD_MANAGEMENT_GUIDE.md
3. Check API logs in terminal

## 🎉 You're Ready!

Navigate to http://localhost:5173/leads and start managing leads!
