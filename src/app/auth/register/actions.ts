'use server'

import { hash } from 'bcrypt'
import { z } from 'zod'
import { prisma } from '@/lib/prisma/client'

const registerSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
  email: z.string().email('Geçerli bir email adresi giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
  role: z.enum(['EMPLOYER', 'CANDIDATE']),
})

export async function register(data: z.infer<typeof registerSchema>) {
  const { name, email, password, role } = registerSchema.parse(data)

  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    throw new Error('Bu email adresi zaten kullanılıyor')
  }

  const hashedPassword = await hash(password, 10)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
  })

  return user
} 