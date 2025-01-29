import { Job, User } from '@prisma/client'

interface JobSchemaProps {
  job: Job & {
    employer: User
  }
}

export default function JobSchema({ job }: JobSchemaProps) {
  const jobSchema = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    datePosted: job.createdAt.toISOString(),
    validThrough: new Date(
      job.createdAt.getTime() + 30 * 24 * 60 * 60 * 1000
    ).toISOString(),
    employmentType: job.type,
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location,
        addressCountry: 'TR',
      },
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jobSchema) }}
    />
  )
} 