import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
  Users,
  TrendingUp,
  Target,
  DollarSign,
  Eye,
  MousePointerClick,
  Car,
  Palette,
  Heart,
  Share2,
  Building2,
  Calendar,
  Clock,
  LogOut,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4']

export function Dashboard() {
  const { user, logout } = useAuth()
  const [dateRange] = useState({ startDate: '', endDate: '' })
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  const { data: statsData } = useQuery({
    queryKey: ['dashboard-stats', dateRange],
    queryFn: () => api.getDashboardStats(dateRange),
  })

  const stats = (statsData as any)?.data || {}

  // Format date and time
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  // Get greeting based on time
  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }

  // Handle logout
  const handleLogout = () => {
    logout()
  }

  // KPI Cards Data
  const kpiCards = [
    {
      title: 'Total Leads',
      value: stats.totalLeads || 0,
      icon: Users,
      color: 'from-blue-500/10 to-blue-600/5',
      border: 'border-blue-500/20',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversionRate || 0}%`,
      icon: TrendingUp,
      color: 'from-emerald-500/10 to-emerald-600/5',
      border: 'border-emerald-500/20',
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-600',
    },
    {
      title: 'Active Leads',
      value: stats.activeLeads || 0,
      icon: Target,
      color: 'from-purple-500/10 to-purple-600/5',
      border: 'border-purple-500/20',
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Revenue',
      value: `$${(stats.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'from-amber-500/10 to-amber-600/5',
      border: 'border-amber-500/20',
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-600',
    },
  ]

  // Interest Level Cards
  const interestCards = [
    {
      title: 'High Interest',
      value: stats.highInterest || 0,
      icon: Heart,
      color: 'from-rose-500/10 to-rose-600/5',
      border: 'border-rose-500/20',
      iconBg: 'bg-rose-500/10',
      iconColor: 'text-rose-600',
    },
    {
      title: 'Medium Interest',
      value: stats.mediumInterest || 0,
      icon: Eye,
      color: 'from-orange-500/10 to-orange-600/5',
      border: 'border-orange-500/20',
      iconBg: 'bg-orange-500/10',
      iconColor: 'text-orange-600',
    },
    {
      title: 'Low Interest',
      value: stats.lowInterest || 0,
      icon: MousePointerClick,
      color: 'from-cyan-500/10 to-cyan-600/5',
      border: 'border-cyan-500/20',
      iconBg: 'bg-cyan-500/10',
      iconColor: 'text-cyan-600',
    },
  ]

  // Conversion Funnel Data - with fallback sample data
  const funnelData = stats.conversionFunnel || [
    { name: 'Visitors', value: 1000, fill: '#3b82f6' },
    { name: 'Inquiries', value: 750, fill: '#10b981' },
    { name: 'Test Drives', value: 500, fill: '#f59e0b' },
    { name: 'Negotiations', value: 250, fill: '#ef4444' },
    { name: 'Closed', value: 100, fill: '#8b5cf6' },
  ]

  // Vehicle Inquiry Data - with fallback sample data
  const vehicleData = stats.vehicleInquiries && stats.vehicleInquiries.length > 0 
    ? stats.vehicleInquiries 
    : [
        { model: 'ATTO 3', count: 45 },
        { model: 'DOLPHIN', count: 32 },
        { model: 'SEAL', count: 28 },
        { model: 'HAN', count: 15 },
      ]

  // Colors Data - with fallback sample data
  const colorData = stats.colorPreferences && stats.colorPreferences.length > 0
    ? stats.colorPreferences
    : [
        { color: 'Black', count: 35 },
        { color: 'White', count: 42 },
        { color: 'Silver', count: 28 },
        { color: 'Blue', count: 18 },
        { color: 'Red', count: 12 },
      ]

  // Leads Interest Data - with fallback sample data
  const interestData = stats.leadsInterest && stats.leadsInterest.length > 0
    ? stats.leadsInterest
    : [
        { level: 'High', count: 45 },
        { level: 'Medium', count: 62 },
        { level: 'Low', count: 28 },
      ]

  // Leads Source Data - with fallback sample data
  const sourceData = stats.leadsSources && stats.leadsSources.length > 0
    ? stats.leadsSources
    : [
        { name: 'Website', value: 45 },
        { name: 'Referral', value: 28 },
        { name: 'Social Media', value: 35 },
        { name: 'Walk-in', value: 22 },
        { name: 'Phone', value: 15 },
      ]

  return (
    <div className="max-w-[1600px] mx-auto space-y-4 pb-4">
      {/* Hero Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 shadow-xl"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        {/* Content */}
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            {/* Left: Welcome Message */}
            <div className="space-y-2 flex-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                  {getGreeting()}, {user?.fullName || 'User'}! 👋
                </h1>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <p className="text-blue-100 text-base md:text-lg">
                  Track your sales performance and key metrics
                </p>
              </motion.div>
            </div>

            {/* Right: Date, Time & Logout */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col gap-2"
              >
                <div className="flex items-center gap-2 text-white/90">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {formatDate(currentTime)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {formatTime(currentTime)}
                  </span>
                </div>
              </motion.div>

              {/* Logout Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                onClick={handleLogout}
                className="group flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/30 rounded-xl transition-all duration-300 active:scale-95"
              >
                <LogOut className="w-4 h-4 text-white group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-sm font-medium text-white">Logout</span>
              </motion.button>
            </div>
          </div>

          {/* Bottom: Scope Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6"
          >
            <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">
              Scope
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {kpiCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-blue-100 mb-1 truncate">
                          {card.title}
                        </p>
                        <p className="text-2xl font-bold text-white">{card.value}</p>
                      </div>
                      <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                        <card.icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="space-y-4 py-4">
        {/* Overview - Interest Level Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
            Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {interestCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
              >
                <Card
                  className={`bg-white/70 backdrop-blur-sm border-zinc-200/60 shadow-sm hover:shadow-md transition-shadow duration-300 bg-gradient-to-br ${card.color} ${card.border}`}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-muted-foreground truncate">
                          {card.title}
                        </p>
                        <p className="text-xl font-semibold mt-0.5">{card.value}</p>
                      </div>
                      <div className={`w-8 h-8 rounded-lg ${card.iconBg} flex items-center justify-center flex-shrink-0`}>
                        <card.icon className={`w-4 h-4 ${card.iconColor}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Conversion Flow - Funnel Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="bg-white/70 backdrop-blur-sm border-zinc-200/60 shadow-sm">
              <CardHeader className="p-3 border-b border-zinc-200/60">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Conversion Flow
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={funnelData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {funnelData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Vehicle Inquiry - Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.35 }}
          >
            <Card className="bg-white/70 backdrop-blur-sm border-zinc-200/60 shadow-sm">
              <CardHeader className="p-3 border-b border-zinc-200/60">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  Vehicle Inquiry
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={vehicleData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="model" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }} 
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Colors - Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card className="bg-white/70 backdrop-blur-sm border-zinc-200/60 shadow-sm">
              <CardHeader className="p-3 border-b border-zinc-200/60">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Colors
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={colorData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="color" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }} 
                    />
                    <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Leads Interest - Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.45 }}
          >
            <Card className="bg-white/70 backdrop-blur-sm border-zinc-200/60 shadow-sm">
              <CardHeader className="p-3 border-b border-zinc-200/60">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Leads Interest
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={interestData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="level" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }} 
                    />
                    <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Leads Source - Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Card className="bg-white/70 backdrop-blur-sm border-zinc-200/60 shadow-sm">
              <CardHeader className="p-3 border-b border-zinc-200/60">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Leads Source
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }: any) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {sourceData.map((_entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Bank Applications - Bonus Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.55 }}
          >
            <Card className="bg-white/70 backdrop-blur-sm border-zinc-200/60 shadow-sm bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 border-indigo-500/20">
              <CardHeader className="p-3 border-b border-zinc-200/60">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Bank Applications
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Pending</span>
                    <span className="text-lg font-semibold">{stats.bankPending || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Approved</span>
                    <span className="text-lg font-semibold text-emerald-600">
                      {stats.bankApproved || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Rejected</span>
                    <span className="text-lg font-semibold text-red-600">
                      {stats.bankRejected || 0}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-zinc-200/60">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">Approval Rate</span>
                      <span className="text-base font-semibold text-indigo-600">
                        {stats.bankApprovalRate || 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
