export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto animate-pulse">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <div className="h-8 w-64 bg-gray-200 rounded mb-2"></div>
            <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
          </div>
          <div className="h-6 w-24 bg-gray-200 rounded"></div>
        </div>

        <div className="flex items-center gap-6 mt-4">
          <div className="h-5 w-32 bg-gray-200 rounded"></div>
          <div className="h-5 w-32 bg-gray-200 rounded"></div>
          <div className="h-5 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Description */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="h-6 w-24 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-6"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
} 