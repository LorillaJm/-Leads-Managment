import { Search, Bell, Settings, User } from 'lucide-react'

export function PremiumHeader() {
  return (
    <header className="h-20 border-b border-slate-200/60 bg-white/60 backdrop-blur-xl sticky top-0 z-50">
      <div className="h-full px-8 flex items-center justify-between">
        {/* Left: Logo & Title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white text-sm font-bold">BYD</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">
                Sales Analytics
              </h1>
              <p className="text-xs text-slate-500">Performance Dashboard</p>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-64 h-10 pl-10 pr-4 bg-slate-100/50 border border-slate-200/60 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 focus:bg-white transition-all"
            />
          </div>

          {/* Notifications */}
          <button className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100/50 transition-colors">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full"></span>
          </button>

          {/* Settings */}
          <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100/50 transition-colors">
            <Settings className="w-5 h-5 text-slate-600" />
          </button>

          {/* User */}
          <button className="flex items-center gap-3 pl-3 pr-4 h-10 rounded-xl hover:bg-slate-100/50 transition-colors">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-slate-900">Admin</div>
              <div className="text-xs text-slate-500">Manager</div>
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}
