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
    console.log('Received job data:', json)
    
    const body = jobSchema.parse(json)
    console.log('Validated job data:', body)

    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), 'public', 'data')
    const jobsPath = path.join(dataDir, 'jobs.json')
    
    console.log('Data directory:', dataDir)
    console.log('Jobs file path:', jobsPath)

    try {
      if (!fs.existsSync(dataDir)) {
        console.log('Creating data directory...')
        fs.mkdirSync(dataDir, { recursive: true })
      }
    } catch (e) {
      console.error('Error creating directory:', e)
      throw new Error('Failed to create data directory')
    }

    // Read existing jobs or create new file
    let jobsData: JobData = { jobs: [] }
    
    try {
      if (fs.existsSync(jobsPath)) {
        console.log('Reading existing jobs file...')
        const fileContent = fs.readFileSync(jobsPath, 'utf8')
        jobsData = JSON.parse(fileContent) as JobData
      } else {
        console.log('Creating new jobs file...')
        fs.writeFileSync(jobsPath, JSON.stringify({ jobs: [] }, null, 2))
      }
    } catch (e) {
      console.error('Error reading/writing jobs file:', e)
      throw new Error('Failed to access jobs data')
    }

    // Create new job
    const newJob = {
      ...body,
      id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      source: 'Manual Entry',
      sourceUrl: '',
    }

    console.log('Created new job:', newJob)

    // Add to beginning of jobs array
    jobsData.jobs.unshift(newJob)

    try {
      console.log('Saving updated jobs file...')
      fs.writeFileSync(jobsPath, JSON.stringify(jobsData, null, 2))
      console.log('Jobs file saved successfully')
    } catch (e) {
      console.error('Error saving jobs file:', e)
      throw new Error('Failed to save job data')
    }

    return NextResponse.json(newJob)
  } catch (error) {
    console.error('Error in POST handler:', error)
    
    if (error instanceof z.ZodError) {
      console.log('Validation error:', error.errors)
      return new NextResponse(JSON.stringify(error.errors), { 
        status: 422,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new NextResponse(
      JSON.stringify({ 
        message: error instanceof Error ? error.message : 'Internal Error',
        error: error instanceof Error ? error.stack : 'Unknown error'
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

export async function GET(request: Request) {
  try {
    console.log('GET request received')
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const location = searchParams.get('location')
    const q = searchParams.get('q')?.toLowerCase()

    console.log('Search params:', { type, location, q })

    // Read jobs from JSON file
    const jobsPath = path.join(process.cwd(), 'public', 'data', 'jobs.json')
    console.log('Jobs file path:', jobsPath)
    
    let jobs = []
    
    try {
      if (fs.existsSync(jobsPath)) {
        console.log('Reading jobs file...')
        const jobsData = JSON.parse(fs.readFileSync(jobsPath, 'utf8'))
        jobs = jobsData.jobs
        console.log(`Found ${jobs.length} jobs`)
      } else {
        console.log('Jobs file does not exist')
      }
    } catch (e) {
      console.error('Error reading jobs file:', e)
      throw new Error('Failed to read jobs data')
    }

    // Apply filters
    if (type) {
      jobs = jobs.filter((job: any) => job.type === type)
      console.log(`After type filter: ${jobs.length} jobs`)
    }
    if (location) {
      jobs = jobs.filter((job: any) => 
        job.location.toLowerCase().includes(location.toLowerCase())
      )
      console.log(`After location filter: ${jobs.length} jobs`)
    }
    if (q) {
      jobs = jobs.filter((job: any) => 
        job.title.toLowerCase().includes(q) ||
        job.description.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q)
      )
      console.log(`After search filter: ${jobs.length} jobs`)
    }

    // Sort by creation date (newest first)
    jobs.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return NextResponse.json(jobs)
  } catch (error) {
    console.error('Error in GET handler:', error)
    return new NextResponse(
      JSON.stringify({ 
        message: error instanceof Error ? error.message : 'Internal Error',
        error: error instanceof Error ? error.stack : 'Unknown error'
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
} 