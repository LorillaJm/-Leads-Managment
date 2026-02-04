export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-8 bg-gray-200 rounded"></div>
            <div className="space-y-2">
              <div className="w-48 h-4 bg-gray-200 rounded"></div>
              <div className="w-64 h-5 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-32 h-6 bg-gray-200 rounded"></div>
            <div className="w-48 h-6 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Left Sidebar Skeleton */}
        <div className="w-48 bg-white border-r border-gray-200 p-4 space-y-4">
          <div className="w-full h-8 bg-gray-200 rounded"></div>
          {[...Array(13)].map((_, i) => (
            <div key={i} className="w-full h-6 bg-gray-200 rounded"></div>
          ))}
        </div>

        {/* KPI Panel Skeleton */}
        <div className="w-56 border-r border-gray-200 p-4 space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-full h-24 bg-gray-200 rounded-lg"></div>
          ))}
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1 p-6 space-y-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="w-full h-48 bg-gray-200 rounded-lg"></div>
            <div className="col-span-2 w-full h-48 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="w-full h-64 bg-gray-200 rounded-lg"></div>
          <div className="w-full h-96 bg-gray-200 rounded-lg"></div>
        </div>

        {/* Right Panel Skeleton */}
        <div className="w-96 p-6">
          <div className="w-full h-full bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  )
}
