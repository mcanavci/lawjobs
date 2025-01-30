import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { prisma } from '@/lib/prisma/client'
import { JobType } from '@prisma/client'
import { authOptions } from '@/lib/auth'
import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'

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
  salary: z.string().optional(),
  type: z.nativeEnum(JobType),
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

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const body = jobSchema.parse(json)

    // Send email with job posting details
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `Yeni İş İlanı: ${body.title} - ${body.company}`,
      html: `
        <h2>Yeni İş İlanı Başvurusu</h2>
        <p><strong>Pozisyon:</strong> ${body.title}</p>
        <p><strong>Şirket:</strong> ${body.company}</p>
        <p><strong>Lokasyon:</strong> ${body.location}</p>
        <p><strong>Tip:</strong> ${body.type}</p>
        ${body.salary ? `<p><strong>Maaş:</strong> ${body.salary}</p>` : ''}
        <h3>İş Tanımı:</h3>
        <div>${body.description}</div>
        <h3>Gereksinimler:</h3>
        <ul>
          ${body.requirements.map(req => `<li>${req}</li>`).join('')}
        </ul>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 422 })
    }

    console.error('Error sending email:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const location = searchParams.get('location')
    const query = searchParams.get('q')?.toLowerCase()

    // Read jobs from JSON file
    const jobsData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/data/jobs.json'), 'utf8'))
    let jobs = jobsData.jobs as Job[]

    // Apply filters
    if (type) {
      jobs = jobs.filter(job => job.type === type)
    }
    if (location) {
      jobs = jobs.filter(job => job.location.toLowerCase().includes(location.toLowerCase()))
    }
    if (query) {
      jobs = jobs.filter(job => 
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query)
      )
    }

    return NextResponse.json(jobs)
  } catch (error) {
    console.error('Error reading jobs:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 