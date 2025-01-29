'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { Building2, MapPin, Clock } from 'lucide-react'
import { Job, User } from '@prisma/client'

interface JobCardProps {
  job: Job & {
    employer: User
  }
}

const jobTypeLabels: Record<string, string> = {
  FULL_TIME: 'Tam Zamanlı',
  PART_TIME: 'Yarı Zamanlı',
  INTERNSHIP: 'Stajyer',
  CONTRACT: 'Sözleşmeli',
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <Link href={`/jobs/${job.id}`} className="block">
      <div className="group relative overflow-hidden rounded-lg bg-white p-6 shadow-sm transition duration-200 hover:shadow-md">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-navy-50">
            <Building2 className="h-6 w-6 text-navy-600" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <h2 className="truncate text-lg font-semibold text-gray-900 group-hover:text-navy-600">
                {job.title}
              </h2>
              <span className="inline-flex items-center rounded-full bg-navy-50 px-2.5 py-0.5 text-xs font-medium text-navy-700">
                {jobTypeLabels[job.type] || job.type}
              </span>
            </div>
            <p className="mt-1 text-sm font-medium text-gray-900">
              {job.employer.name}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <MapPin className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                <span>
                  {formatDistanceToNow(job.createdAt, {
                    addSuffix: true,
                    locale: tr,
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
} 