'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

interface ApplyButtonProps {
  jobId: string
  hasApplied: boolean
}

export default function ApplyButton({ jobId, hasApplied }: ApplyButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleApply = async () => {
    setIsLoading(true)
    
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast({
      title: "Başvurunuz Alındı",
      description: "İş ilanına başvurunuz başarıyla alındı. İşveren sizinle iletişime geçecektir.",
    })
    
    setIsLoading(false)
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