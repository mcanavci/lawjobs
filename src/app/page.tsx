'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  const handleViewJobs = () => {
    // First attempt smooth scroll if on the jobs page
    const jobsSection = document.getElementById('jobs-section')
    if (jobsSection) {
      jobsSection.scrollIntoView({ behavior: 'smooth' })
    } else {
      // If not on jobs page, navigate to it
      router.push('/jobs')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-white">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-navy-600 to-navy-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Tüm{' '}
              <span className="text-navy-600">
                Avukat İş İlanları
              </span>{' '}
              Tek Bir Yerde
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Türkiye'nin önde gelen hukuk bürolarında ve şirketlerinde binlerce fırsat sizi bekliyor.
            </p>
          </div>

          <div className="mt-10 flex justify-center gap-x-6">
            <button
              onClick={handleViewJobs}
              className="rounded-md bg-navy-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-navy-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-600"
            >
              İş İlanlarını Görüntüle
            </button>
            <Link
              href="/jobs/post"
              className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-navy-600 shadow-sm ring-1 ring-inset ring-navy-200 hover:bg-gray-50"
            >
              İlan Ver
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
