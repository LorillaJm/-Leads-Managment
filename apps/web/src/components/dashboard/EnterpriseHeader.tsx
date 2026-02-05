import { Search, Bell, User } from 'lucide-react'

export function EnterpriseHeader() {
  return (
    <header className="h-16 bg-white border-b border-[#E5E7EB]">
      <div className="max-w-[1440px] mx-auto h-full px-6 flex items-center justify-between">
        {/* Left: Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#DC2626] rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">BYD</span>
          </div>
          <h1 className="text-[15px] font-semibold text-[#111827]">
            Sales Dashboard
          </h1>
        </div>

        {/* Right: Search, Notifications, User */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search..."
              className="w-60 h-9 pl-9 pr-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[13px] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#3B82F6] focus:bg-white transition-all"
            />
          </div>

          {/* Notifications */}
          <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#F9FAFB] transition-colors">
            <Bell className="w-5 h-5 text-[#6B7280]" />
          </button>

          {/* User Profile */}
          <button className="flex items-center gap-2 px-3 h-9 rounded-lg hover:bg-[#F9FAFB] transition-colors">
            <div className="w-7 h-7 bg-[#3B82F6] rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-[13px] font-medium text-[#111827]">Admin</span>
          </button>
        </div>
      </div>
    </header>
  )
}
