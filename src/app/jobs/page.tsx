import { Metadata } from 'next'
import { prisma } from '@/lib/prisma/client'
import JobCard from '@/components/jobs/JobCard'

export const metadata: Metadata = {
  title: 'İş İlanları | LawJobs',
  description: 'Hukuk sektöründeki en güncel iş ilanları.',
}

export default async function JobsPage() {
  const jobs = await prisma.job.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      employer: true,
    },
  })

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">İş İlanları</h1>
      <div className="grid gap-6">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  )
} 