import { PrismaClient } from "@/lib/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "./env";

const prismaClientSingleton = () => {
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: env.DATABASE_URL_UNPOOLED.toString() }),
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
