import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { prisma } from '@/lib/prisma/client'
import { JobType } from '@prisma/client'
import { authOptions } from '@/lib/auth'
import nodemailer from 'nodemailer'
import * as fs from 'fs'
import * as path from 'path'

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, // App Password, not your regular Gmail password
  },
})

const jobSchema = z.object({
  title: z.string().min(5),
  company: z.string().min(2),
  location: z.string().min(2),
  description: z.string().min(50),
  requirements: z.array(z.string()),
  type: z.nativeEnum(JobType),
  salary: z.string().optional(),
})

interface Job {
  id: string
  title: string
  company: string
  location: string
  description: string
  requirements: string[]
  type: JobType
  salary?: string
  createdAt: string
}

interface JobData {
  jobs: Job[]
}

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const body = jobSchema.parse(json)

    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), 'src/data')
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    // Read existing jobs or create new file
    const jobsPath = path.join(process.cwd(), 'src/data/jobs.json')
    let jobsData: JobData = { jobs: [] }
    
    if (fs.existsSync(jobsPath)) {
      const fileContent = fs.readFileSync(jobsPath, 'utf8')
      try {
        jobsData = JSON.parse(fileContent) as JobData
      } catch (e) {
        console.error('Error parsing jobs.json:', e)
        // If file is corrupted, start fresh
        jobsData = { jobs: [] }
      }
    }

    // Create new job
    const newJob = {
      ...body,
      id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      source: 'Manual Entry',
      sourceUrl: '',
    }

    // Add to beginning of jobs array
    jobsData.jobs.unshift(newJob)

    // Save back to file
    fs.writeFileSync(jobsPath, JSON.stringify(jobsData, null, 2))

    return NextResponse.json(newJob)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 422 })
    }

    console.error('Error creating job:', error)
    return new NextResponse(
      JSON.stringify({ message: error instanceof Error ? error.message : 'Internal Error' }), 
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const location = searchParams.get('location')
    const q = searchParams.get('q')?.toLowerCase()

    // Read jobs from JSON file
    const jobsPath = path.join(process.cwd(), 'src/data/jobs.json')
    let jobs = []
    
    if (fs.existsSync(jobsPath)) {
      const jobsData = JSON.parse(fs.readFileSync(jobsPath, 'utf8'))
      jobs = jobsData.jobs
    }

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
      jobs = jobs.filter((job: any) => 
        job.title.toLowerCase().includes(q) ||
        job.description.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q)
      )
    }

    // Sort by creation date (newest first)
    jobs.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return NextResponse.json(jobs)
  } catch (error) {
    console.error('Error reading jobs:', error)
    return new NextResponse(
      JSON.stringify({ message: error instanceof Error ? error.message : 'Internal Error' }), 
      { status: 500 }
    )
  }
} 