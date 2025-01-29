'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface ApplyButtonProps {
  jobId: string
  hasApplied: boolean
}

export default function ApplyButton({ jobId, hasApplied }: ApplyButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleApply = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/jobs/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobId }),
      })

      if (!response.ok) {
        throw new Error('Failed to apply')
      }

      router.refresh()
    } catch (error) {
      console.error('Error applying to job:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (hasApplied) {
    return (
      <Button variant="secondary" disabled>
        Başvuruldu
      </Button>
    )
  }

  return (
    <Button onClick={handleApply} disabled={isLoading}>
      {isLoading ? 'Başvuruluyor...' : 'Başvur'}
    </Button>
  )
} 