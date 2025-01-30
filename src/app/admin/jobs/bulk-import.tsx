'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { JobType } from '@prisma/client'

interface JobImport {
  title: string
  company: string
  location: string
  description: string
  requirements: string[]
  type: JobType
  salary?: string
}

export function BulkImport() {
  const { toast } = useToast()
  const [isImporting, setIsImporting] = useState(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    const reader = new FileReader()

    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string
        const rows = text.split('\n').map(row => row.split('\t'))
        const [headers, ...dataRows] = rows

        const jobs: JobImport[] = dataRows
          .filter(row => row.length === headers.length && row[0]) // Skip empty rows
          .map(row => {
            const job: Record<string, any> = {}
            headers.forEach((header, index) => {
              const value = row[index]?.trim()
              switch (header.toLowerCase()) {
                case 'title':
                  job.title = value
                  break
                case 'company':
                  job.company = value
                  break
                case 'location':
                  job.location = value
                  break
                case 'description':
                  job.description = value
                  break
                case 'requirements':
                  job.requirements = value.split(';').map(r => r.trim()).filter(Boolean)
                  break
                case 'type':
                  job.type = value.toUpperCase() as JobType
                  break
                case 'salary':
                  job.salary = value
                  break
              }
            })
            return job as JobImport
          })

        // Send jobs to API
        const response = await fetch('/api/jobs/bulk', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ jobs }),
        })

        if (!response.ok) {
          throw new Error('Failed to import jobs')
        }

        const result = await response.json()
        toast({
          title: 'Success',
          description: `Successfully imported ${result.count} jobs`,
        })
      } catch (error) {
        console.error('Import error:', error)
        toast({
          title: 'Error',
          description: 'Failed to import jobs. Please check your file format.',
          variant: 'destructive',
        })
      } finally {
        setIsImporting(false)
        event.target.value = '' // Reset file input
      }
    }

    reader.readAsText(file)
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Bulk Import Jobs</h2>
      
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Upload a tab-separated (TSV) file with the following columns:
        </p>
        
        <ul className="list-disc list-inside text-sm text-gray-600">
          <li>title (required)</li>
          <li>company (required)</li>
          <li>location (required)</li>
          <li>description (required)</li>
          <li>requirements (optional, separate multiple with semicolons)</li>
          <li>type (FULL_TIME, PART_TIME, or INTERNSHIP)</li>
          <li>salary (optional)</li>
        </ul>

        <div className="flex items-center gap-4">
          <input
            type="file"
            accept=".tsv,.txt"
            onChange={handleFileUpload}
            disabled={isImporting}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-navy-600 file:text-white
              hover:file:bg-navy-700
              disabled:opacity-50"
          />
          {isImporting && <div className="text-sm text-gray-500">Importing...</div>}
        </div>

        <div className="text-sm text-gray-500">
          <a
            href="/template.tsv"
            download
            className="text-navy-600 hover:underline"
          >
            Download template file
          </a>
        </div>
      </div>
    </Card>
  )
} 