import { Agent } from "@atproto/api";
import { APIError, createAuthEndpoint } from "better-auth/api";
import { setSessionCookie } from "better-auth/cookies";
import { parseUserOutput } from "better-auth/db";
import * as z from "zod";
import { logger } from "./logger";

const BSKY_SERVICE = "https://api.bsky.social";

const signInAtprotoBodySchema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(1),
  rememberMe: z.boolean().optional(),
  callbackURL: z.string().optional(),
});

function syntheticEmailFromDid(did: string) {
  return `${did.replace(/:/g, "_")}@bsky-app.local`;
}

type StoredUser = {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null;
  did?: string | null;
  handle?: string | null;
  username?: string | null;
  displayUsername?: string | null;
  atprotoAccessToken?: string | null;
  atprotoRefreshToken?: string | null;
};

export function atproto() {
  return {
    id: "atproto",
    endpoints: {
      signInAtproto: createAuthEndpoint(
        "/sign-in/atproto",
        {
          method: "POST",
          body: signInAtprotoBodySchema,
        },
        async (ctx) => {
          const agent = new Agent({ service: BSKY_SERVICE });

          let sessionData: {
            did: string;
            handle: string;
            email?: string;
            accessJwt: string;
            refreshJwt: string;
          };

          try {
            const { data } = await agent.com.atproto.server.createSession({
              identifier: ctx.body.identifier,
              password: ctx.body.password,
            });
            if (!data.did || !data.accessJwt || !data.refreshJwt) {
              logger.error("Invalid ATProto session response", { data });
              throw APIError.from("UNAUTHORIZED", {
                code: "INVALID_ATPROTO_CREDENTIALS",
                message: "Invalid Bluesky credentials",
              });
            }
            sessionData = {
              did: data.did,
              handle: data.handle,
              email: data.email,
              accessJwt: data.accessJwt,
              refreshJwt: data.refreshJwt,
            };
          } catch {
            throw APIError.from("UNAUTHORIZED", {
              code: "INVALID_ATPROTO_CREDENTIALS",
              message: "Invalid Bluesky credentials",
            });
          }

          logger.info("Finding user", { did: sessionData.did });
          let user = (await ctx.context.adapter.findOne({
            model: "user",
            where: [{ field: "did", value: sessionData.did }],
          })) as StoredUser | null;

          logger.info("User found", { user });

          const userPayload = {
            did: sessionData.did,
            handle: sessionData.handle,
            atprotoAccessToken: sessionData.accessJwt,
            atprotoRefreshToken: sessionData.refreshJwt,
            name: sessionData.handle,
            email: sessionData.email ?? syntheticEmailFromDid(sessionData.did),
            emailVerified: true,
            // username: sessionData.handle.replace(/^@/, ""),
            // displayUsername: sessionData.handle,
          };

          if (!user) {

            logger.info("Creating user", userPayload);
            
            user = ((await ctx.context.internalAdapter.createUser(userPayload).catch((error) => {
              logger.error("Error creating user", { error });
              throw error;
            })) as StoredUser);

            logger.info("User created", { user });
          } else {
            logger.info("Updating user", { userPayload });

            user = (await ctx.context.internalAdapter.updateUser(
              user.id,
              userPayload,
            )) as StoredUser;

            logger.info("User updated", { user });
          }

          if (!user) {
            throw APIError.from("INTERNAL_SERVER_ERROR", {
              code: "FAILED_TO_UPSERT_USER",
              message: "Failed to persist ATProto user",
            });
          }

          logger.info("Creating session", { user: user.id });

          const session = await ctx.context.internalAdapter.createSession(
            user.id,
            ctx.body.rememberMe === false,
          );

          logger.info("Session created", { session: session?.id });

          if (!session) {
            throw APIError.from("INTERNAL_SERVER_ERROR", {
              code: "FAILED_TO_CREATE_SESSION",
              message: "Failed to create session",
            });
          }

          logger.info("Setting session cookie", { session: session.id });

          await setSessionCookie(
            ctx,
            { session, user },
            ctx.body.rememberMe === false,
          );

          if (ctx.body.callbackURL) {
            ctx.setHeader("Location", ctx.body.callbackURL);
          }

          logger.info("Returning redirect", { redirect: !!ctx.body.callbackURL });

          return ctx.json({
            redirect: !!ctx.body.callbackURL,
            token: session.token,
            url: ctx.body.callbackURL,
            user: parseUserOutput(ctx.context.options, user),
            atproto: {
              did: sessionData.did,
              handle: sessionData.handle,
            },
          });
        },
      ),
    },
  };
}
