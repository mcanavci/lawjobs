import { Metadata } from 'next'
import { prisma } from '@/lib/prisma/client'

export const metadata: Metadata = {
  title: 'Avukat İş İlanları 2024 | Güncel Pozisyonlar',
  description:
    'En güncel avukat iş ilanları, stajyer avukat pozisyonları ve hukuk bürosu kariyer fırsatları. Hayalinizdeki işi bulun!',
  keywords:
    'avukat iş ilanları, stajyer avukat iş ilanları, kıdemli avukat iş ilanları, hukuk müşaviri iş ilanları, avukat arayanlar',
  alternates: {
    canonical: 'https://yourdomain.com/jobs',
  },
}

function OrganizationSchema() {
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Avukat İş İlanları',
    url: 'https://yourdomain.com',
    logo: 'https://yourdomain.com/logo.png',
    description: 'Türkiye\'nin en büyük avukat iş ilanları platformu',
    sameAs: [
      'https://twitter.com/avukatisilanlar',
      'https://linkedin.com/company/avukatisilanlar',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
    />
  )
}

export default async function JobsPage() {
  const jobs = await prisma.job.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      employer: true,
    },
  })

  return (
    <>
      <OrganizationSchema />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between md:space-x-4 xl:border-b xl:pb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Avukat İş İlanları
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              {jobs.length} açık pozisyon bulundu
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {jobs.map((job) => (
            <article
              key={job.id}
              className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400"
            >
              <div className="flex-1 min-w-0">
                <a href={`/jobs/${job.id}`} className="focus:outline-none">
                  <h2 className="text-lg font-medium text-gray-900">
                    {job.title}
                  </h2>
                  <p className="text-sm text-gray-500 truncate">
                    {job.company} • {job.location}
                  </p>
                  {job.salary && (
                    <p className="mt-1 text-sm text-gray-500">{job.salary}</p>
                  )}
                </a>
              </div>
            </article>
          ))}
        </div>

        {jobs.length === 0 && (
          <div className="text-center py-12">
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              Henüz ilan bulunmuyor
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Çok yakında yeni ilanlar eklenecek.
            </p>
          </div>
        )}
      </div>
    </>
  )
} 