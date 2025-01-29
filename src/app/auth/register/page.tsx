'use client'

import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { hash } from 'bcrypt'
import { prisma } from '@/lib/prisma/client'
import type { RegisterInput } from './actions'
import { register as registerUser } from './actions'
import { signIn } from 'next-auth/react'

export const metadata: Metadata = {
  title: 'Kayıt Ol - Hukuk İş İlanları',
  description: 'Hukuk iş ilanları platformuna üye olun. İş ilanlarına başvurun veya ilan verin.',
}

const registerSchema = z.object({
  name: z.string().min(2, 'Ad soyad en az 2 karakter olmalıdır'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
  role: z.enum(['CANDIDATE', 'EMPLOYER'], {
    required_error: 'Hesap türü seçiniz',
  }),
  terms: z.literal(true, {
    errorMap: () => ({ message: 'Kullanım koşullarını kabul etmelisiniz' }),
  }),
})

async function register(data: RegisterInput) {
  'use server'

  const { name, email, password, role } = registerSchema.parse(data)

  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    throw new Error('Bu e-posta adresi zaten kullanılıyor')
  }

  const hashedPassword = await hash(password, 10)

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
  })

  redirect('/auth/login?registered=true')
}

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterInput) => {
    try {
      await registerUser(data)
    } catch (error) {
      console.error('Registration failed:', error)
      // TODO: Show error message to user
    }
  }

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/jobs' })
  }

  return (
    <main className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Hesap Oluştur
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Zaten üye misiniz?{' '}
          <Link href="/auth/login" className="font-medium text-navy-600 hover:text-navy-500">
            Giriş yapın
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Ad Soyad
              </label>
              <div className="mt-1">
                <input
                  {...register('name')}
                  type="text"
                  autoComplete="name"
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-navy-500 focus:outline-none focus:ring-navy-500 sm:text-sm"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
            </div>

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
                  autoComplete="new-password"
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-navy-500 focus:outline-none focus:ring-navy-500 sm:text-sm"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Hesap Türü
              </label>
              <div className="mt-1">
                <select
                  {...register('role')}
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-navy-500 focus:outline-none focus:ring-navy-500 sm:text-sm"
                >
                  <option value="">Seçiniz</option>
                  <option value="CANDIDATE">İş Arayan</option>
                  <option value="EMPLOYER">İşveren</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <input
                {...register('terms')}
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-navy-600 focus:ring-navy-500"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                <span>
                  <Link href="/terms" className="text-navy-600 hover:text-navy-500">
                    Kullanım Koşulları
                  </Link>
                  {' '}ve{' '}
                  <Link href="/privacy" className="text-navy-600 hover:text-navy-500">
                    Gizlilik Politikası
                  </Link>
                  'nı kabul ediyorum
                </span>
              </label>
            </div>
            {errors.terms && (
              <p className="mt-1 text-sm text-red-600">{errors.terms.message}</p>
            )}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full justify-center rounded-md border border-transparent bg-navy-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-navy-700 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Kaydediliyor...' : 'Kayıt Ol'}
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
    </main>
  )
} 