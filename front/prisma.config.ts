import "dotenv/config";
import path from "node:path";
import type { PrismaConfig } from "prisma";
import { env } from "./lib/env";

export default {
  schema: path.join("prisma"),
  datasource: {
    url: env.DATABASE_URL,
  }
} satisfies PrismaConfig;