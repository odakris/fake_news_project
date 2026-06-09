import { betterAuth } from "better-auth/minimal";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { username } from "better-auth/plugins/username";
import { prisma } from "@/lib/prisma";
import { atproto } from "@/lib/atproto-plugin";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      did: {
        type: "string",
        required: false,
        input: false,
      },
      handle: {
        type: "string",
        required: false,
        input: false,
      },
      atprotoAccessToken: {
        type: "string",
        required: false,
        input: false,
        returned: true,
      },
      atprotoRefreshToken: {
        type: "string",
        required: false,
        input: false,
        returned: false,
      },
    },
  },
  plugins: [
    username({
      maxUsernameLength: 253,
    }),
    atproto(),
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
