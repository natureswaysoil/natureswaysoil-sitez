// Simple Prisma client wrapper that ensures the client is
// instantiated only once in development.  In production the client
// always creates a new instance.  See the Prisma docs for more
// information.
import { PrismaClient } from '@prisma/client';

let prisma;
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;