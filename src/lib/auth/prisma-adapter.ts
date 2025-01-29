import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma/client'
import { UserRole } from '@prisma/client'
import type { Adapter } from 'next-auth/adapters'

export function CustomPrismaAdapter(): Adapter {
  return {
    ...PrismaAdapter(prisma),
    createUser: async (data) => {
      const user = await prisma.user.create({
        data: {
          ...data,
          role: UserRole.CANDIDATE,
          emailVerified: new Date(),
        },
      })

      return {
        ...user,
        id: user.id,
        emailVerified: user.emailVerified,
      }
    },
    getUser: async (id) => {
      const user = await prisma.user.findUnique({ where: { id } })
      if (!user) return null

      return {
        ...user,
        id: user.id,
        emailVerified: user.emailVerified,
      }
    },
    getUserByEmail: async (email) => {
      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) return null

      return {
        ...user,
        id: user.id,
        emailVerified: user.emailVerified,
      }
    },
  }
} 