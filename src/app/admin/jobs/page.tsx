'use client'

import { useState, useEffect } from 'react'
import { JobType } from '@prisma/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Tiptap } from '@/components/tiptap'
import { BulkImport } from './bulk-import'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const jobSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  company: z.string().min(2, 'Company name must be at least 2 characters'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  requirements: z.array(z.string()),
  type: z.nativeEnum(JobType),
  salary: z.string().optional(),
})

type JobFormData = z.infer<typeof jobSchema>

export default function AdminJobsPage() {
  const [description, setDescription] = useState('')
  const { toast } = useToast()
  const [requirements, setRequirements] = useState<string[]>([])
  const [newRequirement, setNewRequirement] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      type: JobType.FULL_TIME,
      description: '',
    },
  })

  // Register description field with form validation
  useEffect(() => {
    setValue('description', description)
  }, [description, setValue])

  const onSubmit = async (data: JobFormData) => {
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          description,
          requirements,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create job listing')
      }

      toast({
        title: 'Success',
        description: 'Job listing created successfully',
      })

      // Reset form
      reset()
      setDescription('')
      setRequirements([])
      setNewRequirement('')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create job listing. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setRequirements([...requirements, newRequirement.trim()])
      setNewRequirement('')
    }
  }

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index))
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Job Listings Management</h1>

      <Tabs defaultValue="single" className="space-y-6">
        <TabsList>
          <TabsTrigger value="single">Add Single Job</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Import</TabsTrigger>
        </TabsList>

        <TabsContent value="single">
          <Card className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Job Title</label>
                <input
                  {...register('title')}
                  className="w-full p-2 border rounded"
                  placeholder="e.g., Senior Legal Counsel"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Company</label>
                <input
                  {...register('company')}
                  className="w-full p-2 border rounded"
                  placeholder="e.g., Smith & Associates"
                />
                {errors.company && (
                  <p className="text-red-500 text-sm mt-1">{errors.company.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  {...register('location')}
                  className="w-full p-2 border rounded"
                  placeholder="e.g., Istanbul, Turkey"
                />
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Job Type</label>
                <select {...register('type')} className="w-full p-2 border rounded">
                  <option value={JobType.FULL_TIME}>Full Time</option>
                  <option value={JobType.PART_TIME}>Part Time</option>
                  <option value={JobType.INTERNSHIP}>Internship</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Salary (Optional)</label>
                <input
                  {...register('salary')}
                  className="w-full p-2 border rounded"
                  placeholder="e.g., 15,000 - 20,000 TL/month"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Tiptap content={description} onChange={setDescription} />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Requirements</label>
                <div className="flex gap-2 mb-2">
                  <input
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    className="flex-1 p-2 border rounded"
                    placeholder="Add a requirement"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                  />
                  <Button type="button" onClick={addRequirement}>
                    Add
                  </Button>
                </div>
                <ul className="list-disc list-inside space-y-1">
                  {requirements.map((req, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span>{req}</span>
                      <button
                        type="button"
                        onClick={() => removeRequirement(index)}
                        className="text-red-500 text-sm"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Creating...' : 'Create Job Listing'}
              </Button>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="bulk">
          <BulkImport />
        </TabsContent>
      </Tabs>
    </div>
  )
} 