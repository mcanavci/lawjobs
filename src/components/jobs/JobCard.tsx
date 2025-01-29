import type { Job, JobType } from '@/types/prisma'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'

type JobCardProps = {
  job: Job
}

const jobTypeLabels: Record<JobType, string> = {
  FULL_TIME: 'Tam Zamanlı',
  PART_TIME: 'Yarı Zamanlı',
  CONTRACT: 'Sözleşmeli',
  INTERNSHIP: 'Stajyer',
}

export function JobCard({ job }: JobCardProps) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-100 hover:border-navy-200 transition-colors">
      <Link href={`/jobs/${job.id}`}>
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {job.title}
              </h3>
              <p className="text-gray-600 mb-2">{job.company}</p>
            </div>
            <span className="inline-flex items-center rounded-full bg-navy-50 px-2 py-1 text-xs font-medium text-navy-700">
              {jobTypeLabels[job.type]}
            </span>
          </div>
          
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center">
              <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {job.location}
            </div>
            {job.salary && (
              <div className="flex items-center">
                <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {job.salary}
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div className="flex gap-2">
              {job.requirements.slice(0, 3).map((req: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600"
                >
                  {req}
                </span>
              ))}
            </div>
            <time className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true, locale: tr })}
            </time>
          </div>
        </div>
      </Link>
    </div>
  )
} 