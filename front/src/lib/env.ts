import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * This is the schema for the environment variables.
 *
 * Please import **this** file and use the `env` variable
 */
export const env = createEnv({
  server: {
    DATABASE_URL: z.url().default("postgresql://user:password@localhost:5432/fakenewsproject"),
    BETTER_AUTH_SECRET: z
      .string()
      .min(32)
      .default("dev-only-change-me-before-production-0000"),
    BETTER_AUTH_URL: z.url().default("http://localhost:3001"),

    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  },
  experimental__runtimeEnv: {
  },
});
