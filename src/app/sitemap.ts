import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma/client'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://yourdomain.com'

  // Get all active jobs
  const jobs = await prisma.job.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      updatedAt: true,
    },
  })

  // Get unique locations from jobs
  const locations = await prisma.job.findMany({
    where: {
      isActive: true,
    },
    select: {
      location: true,
    },
    distinct: ['location'],
  })

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...jobs.map((job) => ({
      url: `${baseUrl}/jobs/${job.id}`,
      lastModified: job.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...locations.map((loc) => ({
      url: `${baseUrl}/jobs/location/${loc.location.toLowerCase().replace(/\s+/g, '-')}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ]
} 