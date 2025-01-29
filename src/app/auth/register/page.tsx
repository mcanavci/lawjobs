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
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export const metadata: Metadata = {
  title: 'Kayıt Ol - Hukuk İş İlanları',
  description: 'Hukuk iş ilanları platformuna üye olun. İş ilanlarına başvurun veya ilan verin.',
}

const registerSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
  email: z.string().email('Geçerli bir email adresi giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
  role: z.enum(['EMPLOYER', 'CANDIDATE'], {
    required_error: 'Hesap türü seçiniz',
  }),
  terms: z.literal(true, {
    errorMap: () => ({ message: 'Kullanım koşullarını kabul etmelisiniz' }),
  }),
})

type RegisterInput = z.infer<typeof registerSchema>

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
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterInput) => {
    try {
      await registerUser(data)
      router.push('/auth/login?registered=true')
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Bir hata oluştu. Lütfen tekrar deneyin.')
      }
    }
  }

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/jobs' })
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Yeni Hesap Oluşturun
        </h1>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Ad Soyad
            </label>
            <div className="mt-2">
              <input
                {...registerField('name')}
                type="text"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-navy-600 sm:text-sm sm:leading-6"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email
            </label>
            <div className="mt-2">
              <input
                {...registerField('email')}
                type="email"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-navy-600 sm:text-sm sm:leading-6"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Şifre
            </label>
            <div className="mt-2">
              <input
                {...registerField('password')}
                type="password"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-navy-600 sm:text-sm sm:leading-6"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Hesap Türü
            </label>
            <div className="mt-2">
              <select
                {...registerField('role')}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-navy-600 sm:text-sm sm:leading-6"
              >
                <option value="">Seçiniz</option>
                <option value="EMPLOYER">İşveren</option>
                <option value="CANDIDATE">İş Arayan</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <input
              {...registerField('terms')}
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-navy-600 focus:ring-navy-600"
            />
            <label
              htmlFor="terms"
              className="ml-3 block text-sm leading-6 text-gray-900"
            >
              <a
                href="/terms"
                className="font-semibold text-navy-600 hover:text-navy-500"
              >
                Kullanım koşullarını
              </a>{' '}
              kabul ediyorum
            </label>
          </div>
          {errors.terms && (
            <p className="mt-1 text-sm text-red-600">{errors.terms.message}</p>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full justify-center rounded-md bg-navy-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-navy-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-600 disabled:opacity-50"
            >
              {isSubmitting ? 'Kaydediliyor...' : 'Kayıt Ol'}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Zaten üye misiniz?{' '}
          <a
            href="/auth/login"
            className="font-semibold leading-6 text-navy-600 hover:text-navy-500"
          >
            Giriş yapın
          </a>
        </p>
      </div>
    </div>
  )
} 