import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { prisma } from '@/lib/prisma/client'
import { JobType } from '@prisma/client'
import { authOptions } from '@/lib/auth'

const jobSchema = z.object({
  title: z.string().min(5),
  company: z.string().min(2),
  location: z.string().min(2),
  description: z.string().min(50),
  requirements: z.array(z.string()),
  salary: z.string().optional(),
  type: z.nativeEnum(JobType),
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (session.user.role !== 'EMPLOYER') {
      return new NextResponse('Forbidden', { status: 403 })
    }

    const json = await request.json()
    const body = jobSchema.parse(json)

    const job = await prisma.job.create({
      data: {
        ...body,
        employerId: session.user.id,
      },
    })

    return NextResponse.json(job)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 422 })
    }

    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const location = searchParams.get('location')
    const query = searchParams.get('q')

    const jobs = await prisma.job.findMany({
      where: {
        AND: [
          type ? { type: type as JobType } : {},
          location ? { location: { contains: location, mode: 'insensitive' } } : {},
          query
            ? {
                OR: [
                  { title: { contains: query, mode: 'insensitive' } },
                  { description: { contains: query, mode: 'insensitive' } },
                  { companyName: { contains: query, mode: 'insensitive' } },
                ],
              }
            : {},
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(jobs)
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 