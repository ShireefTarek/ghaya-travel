type PrismaClientLike = any;

function createClient(): PrismaClientLike {
  if (process.env.PRISMA_MOCK === '1') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { MockPrismaClient } = require('./prisma.mock');
    return new MockPrismaClient();
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { PrismaClient } = require('@prisma/client');
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
  });
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClientLike };

export const prisma = globalForPrisma.prisma || createClient();

if (process.env.NODE_ENV !== 'production' && process.env.PRISMA_MOCK !== '1') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
