import { betterAuth, User } from "better-auth";
import { z } from "zod";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { getServerUrl } from "./server-url";
import { atprotoAuth, AtprotoProfile, ES256PrivateJwk } from "@/plugin/src";
import { createAuthMiddleware } from "better-auth/api";
import { env } from "./env";
import { AtprotoSession, AtprotoState } from "./generated/prisma/client";
import { NodeSavedSession } from "@atproto/oauth-client-node";
import { logger } from "./logger";



// Load private key from environment
function loadPrivateKey() {
  if (process.env.ATPROTO_PRIVATE_KEY) {
    return JSON.parse(process.env.ATPROTO_PRIVATE_KEY);
  }

  // For local development, try to load from file
  if (typeof window === "undefined") {
    try {
      const fs = require("fs");
      const path = require("path");
      const keyFile = path.join(process.cwd(), ".atproto-key.json");
      if (fs.existsSync(keyFile)) {
        return JSON.parse(fs.readFileSync(keyFile, "utf-8"));
      }
    } catch {
      // Ignore - probably in edge runtime
    }
  }

  // No key found - show instructions
  console.error("❌ No ATProto private key found!");
  console.error("   Set ATPROTO_PRIVATE_KEY environment variable");
  console.error("   Or run: bun run generate-key");

  // Return a placeholder (will fail on actual auth)
  return {
    kty: "EC",
    crv: "P-256",
    x: "placeholder",
    y: "placeholder",
    d: "placeholder",
    alg: "ES256",
    kid: "missing-key",
  };
}

const privateKey = loadPrivateKey();//env.ATPROTO_PRIVATE_KEY as ES256PrivateJwk;

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: getServerUrl(),

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
        if (ctx.path.endsWith("/callback/atproto")) {

          const { iss, state, code } = z.object({
            iss: z.string(),
            state: z.string(),
            code: z.string(),
          }).parse(ctx.query);

          const atprotoState = await ctx.context.adapter.findOne<AtprotoState>({
            model: "atprotoState",
            where:[
              { field: "key", value: state },
            ]
          });

          if (!atprotoState) {
            throw new Error("Atproto state not found");
          }

          logger.info(`Atproto state: ${atprotoState.state}`);

          const atprotoSession = z.object({
            iss: z.string(),
            authMethod: z.object({
              method: z.string(),
              kid: z.string(),
            }),
            verifier: z.string(),
            appState: z.string(),
            dpopJwk: z.object({
              kty: z.string(),
              crv: z.string(),
              x: z.string(),
              y: z.string(),
              d: z.string(),
            }),
          }).parse(JSON.parse(atprotoState.state));

          const user = await ctx.context.internalAdapter.findUserByEmail(`${atprotoSession.appState}@atproto.invalid`);
          if (!user) {
            await ctx.context.internalAdapter.createUser({
              atprotoHandle: atprotoSession.appState,
              name: atprotoSession.appState,
              email: `${atprotoSession.appState}@atproto.invalid`,
            });
          }

          return {
            context: ctx,
          };
        }
    }),
  },

  // URLs are auto-detected from BETTER_AUTH_URL or request headers
  plugins: [
    atprotoAuth({
      mapProfileToUser: (profile: AtprotoProfile): Partial<User> => {
        return {
          id: profile.did,
          name: profile.handle,
          image: profile.avatar,
        };
      },
      clientMetadata: {
        // Only clientName is required - URLs are derived from Better Auth's baseURL
        clientName: "Fake News Project",
      },
      privateKey,
    }),
  ],
});

// Export privateKey for use in jwks.json endpoint
export { privateKey };