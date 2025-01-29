import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">İlan Bulunamadı</h2>
      <p className="text-gray-600 mb-6">
        Aradığınız iş ilanı bulunamadı veya kaldırılmış olabilir.
      </p>
      <Link
        href="/jobs"
        className="text-navy-600 hover:text-navy-700 font-medium flex items-center"
      >
        <svg
          className="mr-2 h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Tüm İlanları Görüntüle
      </Link>
    </div>
  )
} 