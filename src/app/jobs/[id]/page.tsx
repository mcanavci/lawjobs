import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma/client'
import JobSchema from '@/components/JobSchema'

interface Props {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: {
      employer: true,
    },
  })

  if (!job) {
    return {
      title: 'İlan Bulunamadı - Avukat İş İlanları',
      description: 'Aradığınız iş ilanı bulunamadı.',
    }
  }

  const description = `${job.company} firması ${job.location} lokasyonunda ${job.type.toLowerCase()} ${
    job.title
  } pozisyonu için avukat arıyor. ${job.description.substring(0, 150)}...`

  return {
    title: `${job.title} - ${job.company} | Avukat İş İlanları`,
    description,
    keywords: [
      'avukat iş ilanları',
      'hukuk bürosu iş ilanları',
      job.title.toLowerCase(),
      `${job.location.toLowerCase()} avukat iş ilanları`,
      job.type.toLowerCase(),
    ].join(', '),
    alternates: {
      canonical: `https://yourdomain.com/jobs/${job.id}`,
    },
  }
}

export default async function JobDetailPage({ params }: Props) {
  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: {
      employer: true,
    },
  })

  if (!job) {
    notFound()
  }

  return (
    <>
      <JobSchema job={job} />
      <article className="max-w-2xl mx-auto">
        <div className="md:flex md:items-center md:justify-between md:space-x-4 xl:border-b xl:pb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <p className="mt-2 text-sm text-gray-700">
              {job.company} • {job.location}
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <div className="prose max-w-none">
            <h2 className="text-lg font-semibold">İş Tanımı</h2>
            <div dangerouslySetInnerHTML={{ __html: job.description }} />
          </div>

          <div>
            <h2 className="text-lg font-semibold">Gereksinimler</h2>
            <ul className="mt-4 space-y-2">
              {job.requirements.map((requirement, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{requirement}</span>
                </li>
              ))}
            </ul>
          </div>

          {job.salary && (
            <div>
              <h2 className="text-lg font-semibold">Maaş Aralığı</h2>
              <p className="mt-2">{job.salary}</p>
            </div>
          )}
        </div>
      </article>
    </>
  )
} 