'use server'

import { hash } from 'bcrypt'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { prisma } from '@/lib/prisma/client'
import { UserRole } from '@prisma/client'

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.nativeEnum(UserRole),
})

export type RegisterInput = z.infer<typeof registerSchema>

export async function register(data: RegisterInput) {
  const { name, email, password, role } = registerSchema.parse(data)

  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    throw new Error('This email is already in use')
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

  redirect('/auth/login?registered=true')
} 