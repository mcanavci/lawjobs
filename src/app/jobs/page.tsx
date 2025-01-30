import { Metadata } from 'next'
import { JobList } from '@/components/job-list'
import { JobFilters } from '@/components/job-filters'
import * as fs from 'fs'
import * as path from 'path'

export const metadata: Metadata = {
  title: 'İş İlanları | Avukat İş İlanları',
  description:
    'Türkiye\'nin önde gelen hukuk bürolarının ve şirketlerinin avukat iş ilanları. Tam zamanlı, yarı zamanlı ve stajyer avukat pozisyonları.',
  keywords: [
    'avukat iş ilanları',
    'hukuk bürosu iş ilanları',
    'stajyer avukat iş ilanları',
    'hukuk müşaviri iş ilanları',
    'istanbul avukat iş ilanları',
    'ankara avukat iş ilanları',
  ].join(', '),
}

interface Props {
  searchParams: {
    type?: string
    location?: string
    q?: string
  }
}

export default async function JobsPage({ searchParams }: Props) {
  const { type, location, q } = searchParams

  // Read jobs from JSON file
  const jobsPath = path.join(process.cwd(), 'src/data/jobs.json')
  const jobsData = JSON.parse(fs.readFileSync(jobsPath, 'utf8'))
  let jobs = jobsData.jobs

  // Apply filters
  if (type) {
    jobs = jobs.filter((job: any) => job.type === type)
  }
  if (location) {
    jobs = jobs.filter((job: any) => 
      job.location.toLowerCase().includes(location.toLowerCase())
    )
  }
  if (q) {
    const query = q.toLowerCase()
    jobs = jobs.filter((job: any) => 
      job.title.toLowerCase().includes(query) ||
      job.description.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query)
    )
  }

  // Sort by creation date (newest first)
  jobs.sort((a: any, b: any) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">İş İlanları</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <JobFilters />
        </div>
        <div className="lg:col-span-3">
          <JobList jobs={jobs} />
        </div>
      </div>
    </div>
  )
} 