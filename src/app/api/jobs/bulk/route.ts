import { NextResponse } from 'next/server'
import { z } from 'zod'
import { JobType } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const jobSchema = z.object({
  title: z.string().min(5),
  company: z.string().min(2),
  location: z.string().min(2),
  description: z.string().min(50),
  requirements: z.array(z.string()),
  type: z.nativeEnum(JobType),
  salary: z.string().optional(),
})

const bulkImportSchema = z.object({
  jobs: z.array(jobSchema),
})

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const { jobs } = bulkImportSchema.parse(json)

    // Read existing jobs
    const jobsPath = path.join(process.cwd(), 'src/data/jobs.json')
    const existingData = JSON.parse(fs.readFileSync(jobsPath, 'utf8'))
    const existingJobs = existingData.jobs

    // Add new jobs with IDs and timestamps
    const newJobs = jobs.map(job => ({
      ...job,
      id: `bulk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      source: 'Bulk Import',
      sourceUrl: '',
    }))

    // Combine and save
    const allJobs = [...newJobs, ...existingJobs]
    fs.writeFileSync(jobsPath, JSON.stringify({ jobs: allJobs }, null, 2))

    return NextResponse.json({ success: true, count: newJobs.length })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 422 })
    }

    console.error('Error processing bulk import:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
} 