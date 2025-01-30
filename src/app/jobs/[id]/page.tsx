import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma/client'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { Building2, MapPin, Clock } from 'lucide-react'
import ApplyButton from './apply-button'

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
    <div className="container mx-auto py-8">
      <Card className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{job.title}</h1>
            <div className="mt-2 space-y-2">
              <div className="flex items-center text-gray-600">
                <Building2 className="w-4 h-4 mr-2" />
                <span>{job.company}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                <span>
                  {formatDistanceToNow(job.createdAt, {
                    addSuffix: true,
                    locale: tr,
                  })}
                </span>
              </div>
            </div>
            <div className="mt-4">
              <Badge variant="secondary">{job.type}</Badge>
            </div>
          </div>
          <ApplyButton jobId={job.id} hasApplied={false} />
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold">İş Tanımı</h2>
          <div
            className="mt-4 prose max-w-none"
            dangerouslySetInnerHTML={{ __html: job.description }}
          />
        </div>
      </Card>
    </div>
  )
} 