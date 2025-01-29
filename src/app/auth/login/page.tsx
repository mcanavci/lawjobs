'use client'

import { type Metadata } from 'next'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signIn } from 'next-auth/react'
import { useState } from 'react'

const loginSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  password: z.string().min(1, 'Şifre gerekli'),
  remember: z.boolean().optional(),
})

type LoginInput = z.infer<typeof loginSchema>

export const metadata: Metadata = {
  title: 'Giriş Yap - Avukat İş İlanları',
  description: 'Avukat iş ilanları platformuna giriş yapın. İş ilanlarına başvurun veya ilan verin.',
}

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const callbackUrl = searchParams.get('callbackUrl') || '/jobs'
  const registered = searchParams.get('registered')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    try {
      setError(null)
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      })

      if (!result?.error) {
        router.push(callbackUrl)
      } else {
        setError('E-posta veya şifre hatalı')
      }
    } catch (error) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
    }
  }

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl })
  }

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Hesabınıza giriş yapın
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Veya{' '}
          <Link href="/auth/register" className="font-medium text-navy-600 hover:text-navy-500">
            yeni hesap oluşturun
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {registered && (
            <div className="mb-4 p-4 rounded-md bg-green-50 text-green-700">
              Hesabınız başarıyla oluşturuldu. Şimdi giriş yapabilirsiniz.
            </div>
          )}
          {error && (
            <div className="mb-4 p-4 rounded-md bg-red-50 text-red-700">
              {error}
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-posta
              </label>
              <div className="mt-1">
                <input
                  {...register('email')}
                  type="email"
                  autoComplete="email"
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-navy-500 focus:outline-none focus:ring-navy-500 sm:text-sm"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Şifre
              </label>
              <div className="mt-1">
                <input
                  {...register('password')}
                  type="password"
                  autoComplete="current-password"
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-navy-500 focus:outline-none focus:ring-navy-500 sm:text-sm"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  {...register('remember')}
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-navy-600 focus:ring-navy-500"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
                  Beni hatırla
                </label>
              </div>

              <div className="text-sm">
                <Link href="/auth/forgot-password" className="font-medium text-navy-600 hover:text-navy-500">
                  Şifrenizi mi unuttunuz?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full justify-center rounded-md border border-transparent bg-navy-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-navy-700 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Giriş yapılıyor...' : 'Giriş yap'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Veya</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-offset-2"
              >
                <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                  <path
                    d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                    fill="currentColor"
                  />
                </svg>
                Google ile devam et
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 