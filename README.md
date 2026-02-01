# 🚗 Lead Management System

A modern, production-ready Lead Management System built with React, TypeScript, Node.js, and SQLite. Features a beautiful Apple-inspired UI with comprehensive lead tracking, user management, and performance analytics.

 
## ✨ Features

### 🎯 Core Functionality
- **Lead Management** - Create, edit, search, and filter leads with advanced categorization
- **Closed Deals Tracking** - Track completed sales with chassis numbers, VSI numbers, and release dates
- **User Management** - Admin panel for creating and managing users with role-based access control
- **Performance Analytics** - Real-time dashboards with charts and rankings
- **Activity Timeline** - Track all interactions and activities per lead
- **Audit Logging** - Complete audit trail for all system actions

### 👥 User Roles
- **Admin (Management)** - Full system access, user management, overall analytics
- **SC (Sales Consultant)** - Personal leads, own performance metrics, peer rankings

### 🎨 Modern UI/UX
- Apple-inspired design system
- Glass-morphism effects
- Smooth animations with Framer Motion
- Fully responsive (Desktop, Tablet, Mobile)
- Dark mode support
- Interactive charts with Recharts

### 🔒 Security Features
- JWT authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Rate limiting
- Audit logging
- Secure session management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/LorillaJm/-Leads-Managment.git
cd -Leads-Managment
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create `.env` file in `apps/api/`:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this-in-production"
PORT=3001
NODE_ENV=development
```

Create `.env` file in `apps/web/`:
```env
VITE_API_URL=http://localhost:3001/api/v1
```

4. **Set up the database**
```bash
cd apps/api
npx prisma migrate dev
npx prisma db seed
cd ../..
```

5. **Start the development servers**

Terminal 1 (API):
```bash
cd apps/api
npm run dev
```

Terminal 2 (Web):
```bash
cd apps/web
npm run dev
```

6. **Access the application**
- Web: http://localhost:5173
- API: http://localhost:3001

### Default Login Credentials
- **Email**: bydiloilo@gmail.com
- **Password**: admin123

## 📁 Project Structure

```
-Leads-Managment/
├── apps/
│   ├── api/                    # Backend API (Node.js + Express)
│   │   ├── prisma/            # Database schema and migrations
│   │   └── src/
│   │       ├── controllers/   # Route controllers
│   │       ├── services/      # Business logic
│   │       ├── routes/        # API routes
│   │       └── middleware/    # Auth, audit, error handling
│   └── web/                   # Frontend (React + TypeScript)
│       └── src/
│           ├── components/    # Reusable UI components
│           ├── pages/         # Page components
│           ├── contexts/      # React contexts
│           └── lib/           # Utilities and API client
├── packages/
│   └── shared/                # Shared types and schemas
├── documentation/             # Comprehensive documentation
└── README.md
```

## 🎯 Key Features Breakdown

### Dashboard
- **Hero Section** with personalized greeting, live date/time, and logout
- **Scope Cards** - Total Leads, Conversion Rate, Active Leads, Revenue
- **Overview** - Interest level distribution (High, Medium, Low)
- **Conversion Flow** - Visual funnel chart
- **Vehicle Inquiry** - Bar chart of model preferences
- **Color Preferences** - Popular color choices
- **Lead Sources** - Pie chart of lead origins
- **Bank Applications** - Approval tracking

### Lead Management
- Create and edit leads with comprehensive information
- Search and filter by multiple criteria
- Categorize by interest level, vehicle type, and status
- Activity timeline per lead
- No deletion (data integrity requirement)
- Export capabilities

### User Management (Admin Only)
- Create new users with auto-generated passwords
- Edit user information
- Enable/disable user accounts
- Reset passwords
- Role assignment (Admin/SC)
- User activity tracking

### Performance Analytics
- Overall sales rankings
- BEV (Battery Electric Vehicle) rankings
- HEV (Hybrid Electric Vehicle) rankings
- Conversion rate tracking
- Peer comparison for SC users
- Time-based filtering

### Closed Deals
- Track completed sales
- Required fields: Chassis Number, VSI Number, Date Released
- Filter by date range and sales consultant
- Revenue tracking
- Export functionality

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Radix UI** - Accessible primitives
- **TanStack Query** - Data fetching
- **TanStack Table** - Advanced tables
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **Prisma** - ORM
- **SQLite** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Helmet** - Security headers
- **express-rate-limit** - Rate limiting

## 📊 Database Schema

### Main Tables
- **User** - System users (Admin/SC)
- **Lead** - Customer leads
- **ClosedDeal** - Completed sales
- **Activity** - Lead activities
- **AuditLog** - System audit trail

## 🔐 Security

- JWT-based authentication with refresh tokens
- Password hashing with bcrypt (10 rounds)
- Role-based access control (RBAC)
- Rate limiting on all endpoints
- Helmet for security headers
- Audit logging for all actions
- Input validation with Zod
- SQL injection protection via Prisma

## 📱 Responsive Design

- **Desktop** - Full-featured layout with sidebars
- **Tablet** - Optimized grid layouts
- **Mobile** - Bottom navigation, drawer menus, touch-friendly

## 🎨 Design System

- **Colors** - Blue/Indigo primary, semantic colors
- **Typography** - System fonts with proper hierarchy
- **Spacing** - Consistent 4px grid system
- **Shadows** - Subtle elevation system
- **Animations** - Smooth 300ms transitions
- **Glass Effects** - Backdrop blur with transparency

## 📖 Documentation

Comprehensive documentation available in `/documentation/`:
- [Quick Start Guide](./documentation/QUICK_START.md)
- [User Management Guide](./documentation/QUICK_START_USER_MANAGEMENT.md)
- [Lead Management Guide](./documentation/QUICK_START_LEADS.md)
- [Performance System Guide](./documentation/PERFORMANCE_RANKING_GUIDE.md)
- [Security Guide](./documentation/SECURITY.md)
- [Deployment Guide](./documentation/DEPLOYMENT.md)

## 🚀 Deployment

### Production Build

1. **Build the frontend**
```bash
cd apps/web
npm run build
```

2. **Build the backend**
```bash
cd apps/api
npm run build
```

3. **Set production environment variables**
```env
NODE_ENV=production
DATABASE_URL="your-production-database-url"
JWT_SECRET="strong-production-secret"
```

4. **Run migrations**
```bash
npx prisma migrate deploy
```

5. **Start the production server**
```bash
npm start
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Lorilla JM**
- GitHub: [@LorillaJm](https://github.com/LorillaJm)

## 🙏 Acknowledgments

- Design inspired by Apple's design language
- UI components from shadcn/ui
- Icons from Lucide React

## 📞 Support

For support, email bydiloilo@gmail.com or open an issue on GitHub.

---

**Built with ❤️ using React, TypeScript, and Node.js**
