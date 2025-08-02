import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

declare global {
  var prisma: PrismaClient | undefined
}

const prisma = globalThis.prisma || new PrismaClient({
  log: ['query'],
}).$extends(withAccelerate())

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

export default prisma