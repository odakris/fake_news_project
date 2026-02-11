import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "./prisma";
import { getServerUrl } from "./server-url";
import { atprotoAuth } from "atproto-better-auth";
import { env } from "./env";

const privateKey = JSON.parse(env.ATPROTO_PRIVATE_KEY);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: getServerUrl(),
  session: {
    expiresIn: 60 * 60 * 24 * 20, // 20 days
    updateAge: 60 * 60 * 24 * 7, // Refresh session every 7 days
  },
  advanced: {
    cookiePrefix: "fakenewsproject",
  },
  plugins: [
    atprotoAuth({
      clientMetadata: {
        clientId: `${getServerUrl()}/client-metadata.json`,
        clientName: "Fake News Project",
        clientUri: getServerUrl(),
        redirectUris: [`${getServerUrl()}/api/auth/callback/atproto`],
        jwksUri: `${getServerUrl()}/jwks.json`,
      },
      privateKey,
    }),
    // Warning: always last plugin
    nextCookies(),
  ],
});