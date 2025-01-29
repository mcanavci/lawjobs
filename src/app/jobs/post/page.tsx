'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { JobType } from '@prisma/client'
import RichTextEditor from '@/components/RichTextEditor'

const jobSchema = z.object({
  title: z.string().min(5, 'İlan başlığı en az 5 karakter olmalıdır'),
  company: z.string().min(2, 'Şirket adı en az 2 karakter olmalıdır'),
  location: z.string().min(2, 'Lokasyon en az 2 karakter olmalıdır'),
  description: z.string().min(50, 'İş tanımı en az 50 karakter olmalıdır'),
  requirements: z.string().min(10, 'Gereksinimler en az 10 karakter olmalıdır'),
  salary: z.string().optional(),
  type: z.nativeEnum(JobType, {
    errorMap: () => ({ message: 'Çalışma şekli seçiniz' }),
  }),
})

type JobInput = z.infer<typeof jobSchema>

const jobTypeLabels: Record<JobType, string> = {
  FULL_TIME: 'Tam Zamanlı',
  PART_TIME: 'Yarı Zamanlı',
  CONTRACT: 'Sözleşmeli',
  INTERNSHIP: 'Stajyer',
}

export default function PostJobPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<JobInput>({
    resolver: zodResolver(jobSchema),
  })

  const onSubmit = async (data: JobInput) => {
    try {
      setError(null)
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          requirements: data.requirements.split('\n').filter(Boolean),
        }),
      })

      if (!response.ok) {
        throw new Error('İlan oluşturulurken bir hata oluştu')
      }

      const result = await response.json()
      router.push(`/jobs/${result.id}`)
    } catch (error) {
      setError('İlan oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.')
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="md:flex md:items-center md:justify-between md:space-x-4 xl:border-b xl:pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Yeni İş İlanı</h1>
          <p className="mt-2 text-sm text-gray-700">
            İş ilanınızı oluşturun ve binlerce avukata ulaşın.
          </p>
        </div>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <div className="space-y-6 sm:space-y-5">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              İlan Başlığı
            </label>
            <div className="mt-1">
              <input
                {...register('title')}
                type="text"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-navy-500 focus:ring-navy-500 sm:text-sm"
                placeholder="Örn: Kıdemli Avukat"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700">
              Şirket / Kurum Adı
            </label>
            <div className="mt-1">
              <input
                {...register('company')}
                type="text"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-navy-500 focus:ring-navy-500 sm:text-sm"
                placeholder="Örn: ABC Hukuk Bürosu"
              />
              {errors.company && (
                <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Lokasyon
            </label>
            <div className="mt-1">
              <input
                {...register('location')}
                type="text"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-navy-500 focus:ring-navy-500 sm:text-sm"
                placeholder="Örn: İstanbul, Türkiye"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Çalışma Şekli
            </label>
            <div className="mt-1">
              <select
                {...register('type')}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-navy-500 focus:ring-navy-500 sm:text-sm"
              >
                <option value="">Seçiniz</option>
                {Object.entries(jobTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
              Maaş Aralığı (Opsiyonel)
            </label>
            <div className="mt-1">
              <input
                {...register('salary')}
                type="text"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-navy-500 focus:ring-navy-500 sm:text-sm"
                placeholder="Örn: 25,000 - 35,000 TL"
              />
              {errors.salary && (
                <p className="mt-1 text-sm text-red-600">{errors.salary.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              İş Tanımı
            </label>
            <div className="mt-1">
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.description?.message}
                    placeholder="İş tanımını detaylı bir şekilde yazınız..."
                  />
                )}
              />
            </div>
          </div>

          <div>
            <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">
              Gereksinimler
            </label>
            <div className="mt-1">
              <textarea
                {...register('requirements')}
                rows={5}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-navy-500 focus:ring-navy-500 sm:text-sm"
                placeholder="Her satıra bir gereksinim yazınız..."
              />
              <p className="mt-2 text-sm text-gray-500">
                Her satıra bir gereksinim yazınız. Örn:
                <br />5 yıl deneyim
                <br />İngilizce (akıcı)
                <br />Kurumsal hukuk tecrübesi
              </p>
              {errors.requirements && (
                <p className="mt-1 text-sm text-red-600">{errors.requirements.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="pt-5">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-offset-2"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-navy-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-navy-700 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Kaydediliyor...' : 'İlanı Yayınla'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
} 