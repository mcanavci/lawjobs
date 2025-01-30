import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { Building2, MapPin } from 'lucide-react'

interface Job {
  id: string
  title: string
  company: string
  location: string
  type: string
  createdAt: string
}

interface JobListProps {
  jobs: Job[]
}

export function JobList({ jobs }: JobListProps) {
  if (jobs.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500">
          Aradığınız kriterlere uygun iş ilanı bulunamadı.
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <Link key={job.id} href={`/jobs/${job.id}`}>
          <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{job.title}</h2>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center text-gray-600">
                    <Building2 className="w-4 h-4 mr-2" />
                    <span>{job.company}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{job.location}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <Badge variant="secondary">{job.type}</Badge>
                <span className="text-sm text-gray-500 mt-2">
                  {formatDistanceToNow(new Date(job.createdAt), {
                    addSuffix: true,
                    locale: tr,
                  })}
                </span>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
} 