import { PrismaClient } from '@prisma/client'

type PrismaClientType = PrismaClient

export type Job = NonNullable<Awaited<ReturnType<PrismaClientType['job']['findUnique']>>>
export type User = NonNullable<Awaited<ReturnType<PrismaClientType['user']['findUnique']>>>
export type JobApplication = NonNullable<Awaited<ReturnType<PrismaClientType['jobApplication']['findUnique']>>>

export enum JobType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  INTERNSHIP = 'INTERNSHIP',
}

export enum UserRole {
  ADMIN = 'ADMIN',
  EMPLOYER = 'EMPLOYER',
  CANDIDATE = 'CANDIDATE',
}

export enum JobSource {
  DIRECT = 'DIRECT',
  LINKEDIN = 'LINKEDIN',
  SCRAPED = 'SCRAPED',
}

export enum ApplicationStatus {
  PENDING = 'PENDING',
  REVIEWED = 'REVIEWED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
} 