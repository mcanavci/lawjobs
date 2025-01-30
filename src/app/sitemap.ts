import { MetadataRoute } from 'next'
import * as fs from 'fs'
import * as path from 'path'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Read jobs from JSON file
  const jobsPath = path.join(process.cwd(), 'src/data/jobs.json')
  const jobsData = JSON.parse(fs.readFileSync(jobsPath, 'utf8'))
  const jobs = jobsData.jobs

  return [
    {
      url: 'https://lawjobs.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://lawjobs.vercel.app/jobs',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...jobs.map((job: any) => ({
      url: `https://lawjobs.vercel.app/jobs/${job.id}`,
      lastModified: new Date(job.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    })),
  ]
} 