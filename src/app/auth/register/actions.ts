'use server'

import { z } from 'zod'
import { hash } from 'bcrypt'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma/client'

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

export type RegisterInput = z.infer<typeof registerSchema>

export async function register(data: RegisterInput) {
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