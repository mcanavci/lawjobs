import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma/client'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://yourdomain.com'

  // Get all jobs
  const jobs = await prisma.job.findMany({
    select: {
      id: true,
      updatedAt: true,
    },
  })

  const jobUrls = jobs.map((job) => ({
    url: `${baseUrl}/jobs/${job.id}`,
    lastModified: job.updatedAt,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/auth/register`,
      lastModified: new Date(),
    },
    ...jobUrls,
  ]
} 