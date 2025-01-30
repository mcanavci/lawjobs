'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { JobType } from '@prisma/client'

export function JobFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleTypeChange = (type: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (type) {
      params.set('type', type)
    } else {
      params.delete('type')
    }
    router.push(`/jobs?${params.toString()}`)
  }

  const handleLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const location = event.target.value
    const params = new URLSearchParams(searchParams.toString())
    if (location) {
      params.set('location', location)
    } else {
      params.delete('location')
    }
    router.push(`/jobs?${params.toString()}`)
  }

  const currentType = searchParams.get('type') || ''
  const currentLocation = searchParams.get('location') || ''

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-3">İş Tipi</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value=""
                checked={currentType === ''}
                onChange={() => handleTypeChange('')}
                className="mr-2"
              />
              Tümü
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value={JobType.FULL_TIME}
                checked={currentType === JobType.FULL_TIME}
                onChange={() => handleTypeChange(JobType.FULL_TIME)}
                className="mr-2"
              />
              Tam Zamanlı
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value={JobType.PART_TIME}
                checked={currentType === JobType.PART_TIME}
                onChange={() => handleTypeChange(JobType.PART_TIME)}
                className="mr-2"
              />
              Yarı Zamanlı
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value={JobType.INTERNSHIP}
                checked={currentType === JobType.INTERNSHIP}
                onChange={() => handleTypeChange(JobType.INTERNSHIP)}
                className="mr-2"
              />
              Stajyer
            </label>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3">Şehir</h3>
          <select
            value={currentLocation}
            onChange={handleLocationChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Tüm Şehirler</option>
            <option value="Istanbul">İstanbul</option>
            <option value="Ankara">Ankara</option>
            <option value="Izmir">İzmir</option>
            <option value="Antalya">Antalya</option>
            <option value="Bursa">Bursa</option>
          </select>
        </div>
      </div>
    </Card>
  )
} 