import { Job, User } from '@prisma/client'

interface JobSchemaProps {
  job: Job & {
    employer: User
  }
}

export default function JobSchema({ job }: JobSchemaProps) {
  const jobSchema = {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    datePosted: job.createdAt,
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
    ...(job.salary && {
      baseSalary: {
        '@type': 'MonetaryAmount',
        currency: 'TRY',
        value: {
          '@type': 'QuantitativeValue',
          value: job.salary,
          unitText: 'MONTH',
        },
      },
    }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jobSchema) }}
    />
  )
} 