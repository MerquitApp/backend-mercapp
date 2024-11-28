import { PrismaClient } from '@prisma/client';

declare module '@prisma/client' {
  interface PrismaClient {
    $on(event: 'beforeExit' | any, callback: (...args: any[]) => void): void;
  }
}
