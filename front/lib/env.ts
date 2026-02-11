import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * This is the schema for the environment variables.
 *
 * Please import **this** file and use the `env` variable
 */
export const env = createEnv({
  server: {
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.string().min(1),
    DATABASE_URL: z.url(),

    AUTH_BLUESKY_ID: z.string().optional(),
    AUTH_BLUESKY_SECRET: z.string().optional(),

    NODE_ENV: z.enum(["development", "production", "test"]),
  },
  experimental__runtimeEnv: {
  },
});
