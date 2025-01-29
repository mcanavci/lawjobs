export default function Loading() {
  return (
    <div>
      <div className="mb-8 animate-pulse">
        <div className="h-8 w-64 bg-gray-200 rounded"></div>
        <div className="mt-2 h-4 w-96 bg-gray-200 rounded"></div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white shadow rounded-lg overflow-hidden border border-gray-100">
            <div className="p-6 animate-pulse">
              <div className="flex justify-between items-start">
                <div>
                  <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </div>
                <div className="h-6 w-24 bg-gray-200 rounded"></div>
              </div>
              
              <div className="mt-4 flex items-center gap-4">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-gray-200 rounded"></div>
                  <div className="h-6 w-16 bg-gray-200 rounded"></div>
                  <div className="h-6 w-16 bg-gray-200 rounded"></div>
                </div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 