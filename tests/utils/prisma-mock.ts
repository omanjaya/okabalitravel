/**
 * Prisma mock utilities for testing database operations
 */

import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'

import { prisma } from '@/server/db/client'

jest.mock('@/server/db/client', () => ({
  __esModule: true,
  prisma: mockDeep<PrismaClient>(),
}))

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>

/**
 * Reset prisma mock before each test
 */
beforeEach(() => {
  mockReset(prismaMock)
})

/**
 * Mock Prisma responses
 */
export const mockPrismaResponse = {
  user: {
    findUnique: (data: any) => prismaMock.user.findUnique.mockResolvedValue(data),
    findMany: (data: any[]) => prismaMock.user.findMany.mockResolvedValue(data),
    create: (data: any) => prismaMock.user.create.mockResolvedValue(data),
    update: (data: any) => prismaMock.user.update.mockResolvedValue(data),
    delete: () => prismaMock.user.delete.mockResolvedValue({} as any),
  },
  booking: {
    findUnique: (data: any) => prismaMock.booking.findUnique.mockResolvedValue(data),
    findMany: (data: any[]) => prismaMock.booking.findMany.mockResolvedValue(data),
    create: (data: any) => prismaMock.booking.create.mockResolvedValue(data),
    update: (data: any) => prismaMock.booking.update.mockResolvedValue(data),
    delete: () => prismaMock.booking.delete.mockResolvedValue({} as any),
  },
  tour: {
    findUnique: (data: any) => prismaMock.tour.findUnique.mockResolvedValue(data),
    findMany: (data: any[]) => prismaMock.tour.findMany.mockResolvedValue(data),
    create: (data: any) => prismaMock.tour.create.mockResolvedValue(data),
    update: (data: any) => prismaMock.tour.update.mockResolvedValue(data),
    delete: () => prismaMock.tour.delete.mockResolvedValue({} as any),
  },
  review: {
    findUnique: (data: any) => prismaMock.review.findUnique.mockResolvedValue(data),
    findMany: (data: any[]) => prismaMock.review.findMany.mockResolvedValue(data),
    create: (data: any) => prismaMock.review.create.mockResolvedValue(data),
    update: (data: any) => prismaMock.review.update.mockResolvedValue(data),
    delete: () => prismaMock.review.delete.mockResolvedValue({} as any),
  },
}
