import { PrismaClient, JobType, UserRole } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await hash('admin123', 10)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@lawjobs.com',
      name: 'Admin User',
      password: adminPassword,
      role: UserRole.ADMIN,
    },
  })

  // Create employer user
  const employerPassword = await hash('employer123', 10)
  const employer = await prisma.user.create({
    data: {
      email: 'employer@lawfirm.com',
      name: 'Law Firm HR',
      password: employerPassword,
      role: UserRole.EMPLOYER,
    },
  })

  // Create candidate user
  const candidatePassword = await hash('candidate123', 10)
  const candidate = await prisma.user.create({
    data: {
      email: 'candidate@email.com',
      name: 'John Doe',
      password: candidatePassword,
      role: UserRole.CANDIDATE,
    },
  })

  // Create some jobs
  const jobs = await Promise.all([
    prisma.job.create({
      data: {
        employerId: employer.id,
        title: 'Senior Corporate Lawyer',
        company: 'Big Law Firm LLP',
        location: 'London, UK',
        type: JobType.FULL_TIME,
        description: 'We are seeking a senior corporate lawyer with extensive M&A experience.',
      },
    }),
    prisma.job.create({
      data: {
        employerId: employer.id,
        title: 'Junior Associate',
        company: 'Big Law Firm LLP',
        location: 'Manchester, UK',
        type: JobType.FULL_TIME,
        description: 'Entry-level position for recent law graduates.',
      },
    }),
    prisma.job.create({
      data: {
        employerId: employer.id,
        title: 'Legal Intern',
        company: 'Big Law Firm LLP',
        location: 'Birmingham, UK',
        type: JobType.INTERNSHIP,
        description: 'Summer internship program for law students.',
      },
    }),
  ])

  // Create some job applications
  await Promise.all([
    prisma.jobApplication.create({
      data: {
        userId: candidate.id,
        jobId: jobs[0].id,
      },
    }),
    prisma.jobApplication.create({
      data: {
        userId: candidate.id,
        jobId: jobs[1].id,
      },
    }),
  ])
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 