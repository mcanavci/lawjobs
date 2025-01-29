import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { Building2, MapPin, Clock } from 'lucide-react'
import { Job, User } from '@prisma/client'

interface JobCardProps {
  job: Job & {
    employer: User
  }
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <Link href={`/jobs/${job.id}`}>
      <Card className="p-6 hover:border-gray-400 transition-colors">
        <div>
          <h2 className="text-xl font-semibold">{job.title}</h2>
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
      </Card>
    </Link>
  )
} 