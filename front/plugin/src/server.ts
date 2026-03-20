import { NodeOAuthClient, JoseKey } from "@atproto/oauth-client-node";
import type {
  NodeSavedSession,
  NodeSavedState,
} from "@atproto/oauth-client-node";
import { Agent } from "@atproto/api";
import type { Account, BetterAuthPlugin } from "better-auth";
import { createAuthEndpoint, createAuthMiddleware, sessionMiddleware } from "better-auth/api";
import { z } from "zod";
import { atprotoSchema } from "./schema";
import type {
  AtprotoAuthOptions,
  AtprotoClientMetadata,
  AtprotoProfile,
  AtprotoSessionInfo,
} from "./types";
import { logger } from "@/lib/logger";

/**
 * Helper to get the app origin from Better Auth's baseURL.
 * Better Auth's baseURL includes the auth path (e.g., http://localhost:3000/api/auth)
 * We need just the origin (e.g., http://localhost:3000) for client_id and jwks_uri.
 */
function getAppOrigin(authBaseURL: string): string {
  try {
    return new URL(authBaseURL).origin;
  } catch {
    return authBaseURL;
  }
}

/**
 * Creates the ATProto better-auth plugin for server-side use.
 */
export function atprotoAuth(options: AtprotoAuthOptions): BetterAuthPlugin {
  const {
    clientMetadata,
    privateKey,
    mapProfileToUser,
  } = options;

  // We'll initialize the OAuth client lazily since we need the auth context for baseURL
  let oauthClient: NodeOAuthClient | null = null;
  let keysetPromise: Promise<JoseKey[]> | null = null;
  let resolvedClientMetadata: AtprotoClientMetadata | null = null;

  // Helper to build client metadata with resolved URLs
  function buildClientMetadata(authBaseURL: string): AtprotoClientMetadata {
    if (resolvedClientMetadata) return resolvedClientMetadata;

    // authBaseURL is the full auth path (e.g., https://example.com/api/auth)
    // appOrigin is just the origin (e.g., https://example.com)
    const appOrigin = getAppOrigin(authBaseURL);

    resolvedClientMetadata = {
      client_id: clientMetadata.clientId ?? `${appOrigin}/client-metadata.json`,
      client_name: clientMetadata.clientName,
      client_uri: clientMetadata.clientUri ?? appOrigin,
      logo_uri: clientMetadata.logoUri,
      tos_uri: clientMetadata.tosUri,
      policy_uri: clientMetadata.policyUri,
      redirect_uris: clientMetadata.redirectUris ?? [`${authBaseURL}/callback/atproto`],
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      scope: clientMetadata.scope ?? "atproto transition:generic",
      dpop_bound_access_tokens: true,
      application_type: "web",
      token_endpoint_auth_method: clientMetadata.jwksUri ?? `${appOrigin}/jwks.json`
        ? "private_key_jwt"
        : "none",
      token_endpoint_auth_signing_alg: clientMetadata.jwksUri ?? `${appOrigin}/jwks.json`
        ? "ES256"
        : undefined,
      jwks_uri: clientMetadata.jwksUri ?? `${appOrigin}/jwks.json`,
    };

    return resolvedClientMetadata;
  }

  // Helper to get or create OAuth client
  async function getOAuthClient(adapter: DatabaseAdapter, authBaseURL: string): Promise<NodeOAuthClient> {
    if (oauthClient) return oauthClient;

    if (!keysetPromise) {
      keysetPromise = Promise.all([
        JoseKey.fromImportable(JSON.stringify(privateKey)),
      ]);
    }

    const keyset = await keysetPromise;
    const fullClientMetadata = buildClientMetadata(authBaseURL);

    oauthClient = new NodeOAuthClient({
      clientMetadata: {
        ...fullClientMetadata,
        // Ensure redirect_uris is a non-empty tuple
        redirect_uris: fullClientMetadata.redirect_uris as [string, ...string[]],
      },
      keyset,

      // State store for OAuth authorization flow
      stateStore: {
        async set(key: string, state: NodeSavedState): Promise<void> {
          // Delete any existing state with this key
          try {

            const atprotoStateExists = await adapter.findOne<{
              key: string;
              state: string;
            }>({
              model: "atprotoState",
              where: [{ field: "key", value: key }],
            });

            if (atprotoStateExists) {

              logger.info(`Will delete atproto state: ${atprotoStateExists}`);

              await adapter.delete({
                model: "atprotoState",
                where: [{ field: "key", value: key }],
              });
            }

          } catch {
            // Ignore if doesn't exist
          }

          await adapter.create({
            model: "atprotoState",
            data: {
              key,
              state: JSON.stringify(state),
              expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
            },
          });
        },

        async get(key: string): Promise<NodeSavedState | undefined> {
          const record = await adapter.findOne<{
            state: string;
            expiresAt: Date;
          }>({
            model: "atprotoState",
            where: [{ field: "key", value: key }],
          });

          if (!record) return undefined;

          // Check if expired
          if (new Date(record.expiresAt) < new Date()) {
            await adapter.delete({
              model: "atprotoState",
              where: [{ field: "key", value: key }],
            });
            return undefined;
          }

          return JSON.parse(record.state) as NodeSavedState;
        },

        async del(key: string): Promise<void> {
          await adapter.delete({
            model: "atprotoState",
            where: [{ field: "key", value: key }],
          });
        },
      },

      // Session store for ATProto OAuth sessions
      sessionStore: {
        async set(did: string, session: NodeSavedSession): Promise<void> {

          console.log("sessionStore set", did, session);
          

          const existing = await adapter.findOne<{ did: string, userId: string }>({
            model: "atprotoSession",
            where: [{ field: "did", value: did }],
          });

          if (existing) {
            await adapter.update({
              model: "atprotoSession",
              where: [{ field: "did", value: did }],
              update: {
                session: JSON.stringify(session),
                updatedAt: new Date(),
              },
            });
          } else {
            // Session might be created before we know the userId
            // The callback endpoint will update with the correct userId
            await adapter.create({
              model: "atprotoSession",
              data: {
                did,
                session: JSON.stringify(session),
                userId: null, // Will be updated by callback
                updatedAt: new Date(),
              },
            });
          }
        },

        async get(did: string): Promise<NodeSavedSession | undefined> {
          const record = await adapter.findOne<{ session: string }>({
            model: "atprotoSession",
            where: [{ field: "did", value: did }],
          });

          if (!record || !record.session) return undefined;

          return JSON.parse(record.session) as NodeSavedSession;
        },

        async del(did: string): Promise<void> {
          await adapter.delete({
            model: "atprotoSession",
            where: [{ field: "did", value: did }],
          });
        },
      },
    });

    return oauthClient;
  }

  return {
    id: "atproto",
    schema: atprotoSchema,

    endpoints: {
      signInAtproto: createAuthEndpoint(
        "/atproto/sign-in",
        {
          method: "GET",
          query: z.object({
            handle: z.string().min(1),
            callbackURL: z.string().optional(),
          }),
        },
        async (ctx) => {
          const { handle, callbackURL } = ctx.query;

          const client = await getOAuthClient(ctx.context.adapter, ctx.context.baseURL);

          // Store the callback URL in state if provided
          // const state = callbackURL ? JSON.stringify({ callbackURL }) : undefined
          const state = handle;


          // Start the OAuth flow
          const authUrl = await client.authorize(handle, { state });

          logger.info(`Auth URL: ${authUrl}`);

          // Redirect to the ATProto authorization server
          throw ctx.redirect(authUrl.toString());
        }
      ),

      callbackAtproto: createAuthEndpoint(
        "/callback/atproto",
        {
          method: "GET",
          query: z.object({
            code: z.string().optional(),
            state: z.string().optional(),
            iss: z.string().optional(),
            error: z.string().optional(),
            error_description: z.string().optional(),
          }),
        },
        async (ctx) => {
          const client = await getOAuthClient(ctx.context.adapter, ctx.context.baseURL);

          // Get the URL search params from the request
          const url = new URL(ctx.request?.url ?? "", "http://localhost");
          const params = url.searchParams;

          console.log("Callback params: ", params);
          console.log(params.get('response'), params.get('response') != null);

          // Complete the OAuth callback
          const { session: atprotoSession, state } =
            await client.callback(params);

          // Parse state to get callback URL
          let callbackURL = "/";
          if (state) {
            try {
              const parsed = JSON.parse(state);
              if (parsed.callbackURL) {
                callbackURL = parsed.callbackURL;
              }
            } catch {
              // State might just be a string, ignore
            }
          }

          // Get user profile from ATProto
          const agent = new Agent(atprotoSession);
          const profileResponse = await agent.getProfile({
            actor: atprotoSession.did,
          });

          const profile: AtprotoProfile = {
            did: atprotoSession.did,
            handle: profileResponse.data.handle,
            displayName: profileResponse.data.displayName,
            avatar: profileResponse.data.avatar,
            description: profileResponse.data.description,
            banner: profileResponse.data.banner,
          };

          // Check if we have an existing account for this DID
          const existingAccount = await ctx.context.adapter.findOne<Account>({
            model: "account",
            where: [
              { field: "providerId", value: "atproto" },
              { field: "accountId", value: profile.did },
            ],
          });

          let userId: string;

          if (existingAccount) {
            // Existing user - update the ATProto session
            userId = existingAccount.userId;

            // Update account info
            await ctx.context.adapter.update({
              model: "account",
              where: [{ field: "id", value: existingAccount.id }],
              update: {
                accessToken: "atproto-session", // Placeholder, real session stored separately
                updatedAt: new Date(),
              },
            });

            // Update user's ATProto fields (handle/profile may have changed)
            await ctx.context.adapter.update({
              model: "user",
              where: [{ field: "id", value: userId }],
              update: {
                atprotoHandle: profile.handle,
                atprotoBio: profile.description,
                atprotoBanner: profile.banner,
                atprotoDid: profile.did,
                image: profile.avatar,
                name: profile.displayName ?? profile.handle,
                updatedAt: new Date(),
              },
            });
          } else {
            // Check if there's a logged-in user to link to
            const currentSession = ctx.context.session;

            if (currentSession?.user) {
              // Link to existing user
              userId = currentSession.user.id;
            } else {
              // Create new user
              const userFields = mapProfileToUser
                ? mapProfileToUser(profile)
                : {};

              const newUser = await ctx.context.internalAdapter.createUser({
                name: profile.displayName ?? profile.handle,
                email: `${profile.handle}@atproto.invalid`, // Placeholder email
                image: profile.avatar,
                emailVerified: false,
                atprotoDid: profile.did,
                atprotoHandle: profile.handle,
                atprotoBio: profile.description,
                atprotoBanner: profile.banner,
                ...userFields,
              });

              userId = newUser.id;
            }

            // Create account record
            await ctx.context.adapter.create({
              model: "account",
              data: {
                userId,
                providerId: "atproto",
                accountId: profile.did,
                accessToken: "atproto-session",
                refreshToken: null,
                expiresAt: null,
                scope: clientMetadata.scope ?? "atproto transition:generic",
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            });
          }

          // Store/update the ATProto session in our custom table
          const existingAtprotoSession = await ctx.context.adapter.findOne<{
            did: string;
          }>({
            model: "atprotoSession",
            where: [{ field: "did", value: profile.did }],
          });

          if (existingAtprotoSession) {
            await ctx.context.adapter.update({
              model: "atprotoSession",
              where: [{ field: "did", value: profile.did }],
              update: {
                userId,
                updatedAt: new Date(),
              },
            });
          } else {
            await ctx.context.adapter.create({
              model: "atprotoSession",
              data: {
                did: profile.did,
                session: "", // Session is stored by the OAuth client's sessionStore
                userId,
                updatedAt: new Date(),
              },
            });
          }

          // Create a better-auth session
          const session = await ctx.context.internalAdapter.createSession(
            userId,
            undefined, // dontRememberMe
            undefined, // override
          );

          // Set session cookie
          const sessionCookie = ctx.context.authCookies.sessionToken;
          await ctx.setSignedCookie(
            sessionCookie.name,
            session.token,
            ctx.context.secret,
            sessionCookie.attributes
          );

          // Redirect to callback URL
          throw ctx.redirect(callbackURL);
        }
      ),

      getAtprotoSession: createAuthEndpoint(
        "/atproto/session",
        {
          method: "GET",
        },
        async (ctx) => {
          const currentSession = ctx.context.session;
          if (!currentSession?.user) {
            return ctx.json({ session: null });
          }

          // Find the ATProto account for this user
          const account = await ctx.context.adapter.findOne<{
            accountId: string;
          }>({
            model: "account",
            where: [
              { field: "userId", value: currentSession.user.id },
              { field: "providerId", value: "atproto" },
            ],
          });

          if (!account) {
            return ctx.json({ session: null });
          }

          const client = await getOAuthClient(ctx.context.adapter, ctx.context.baseURL);

          try {
            // Try to restore the ATProto session
            const atprotoSession = await client.restore(account.accountId);
            const agent = new Agent(atprotoSession);
            const profileResponse = await agent.getProfile({
              actor: atprotoSession.did,
            });

            const sessionInfo: AtprotoSessionInfo = {
              did: atprotoSession.did,
              handle: profileResponse.data.handle,
              displayName: profileResponse.data.displayName,
              avatar: profileResponse.data.avatar,
              active: true,
            };

            return ctx.json({ session: sessionInfo });
          } catch {
            // Session is invalid or expired
            return ctx.json({
              session: {
                did: account.accountId,
                handle: "",
                active: false,
              } as AtprotoSessionInfo,
            });
          }
        }
      ),

      restoreAtprotoAgent: createAuthEndpoint(
        "/atproto/restore",
        {
          method: "POST",
        },
        async (ctx) => {
          const currentSession = ctx.context.session;
          if (!currentSession?.user) {
            return ctx.json({ error: "Not authenticated" }, { status: 401 });
          }

          // Find the ATProto account for this user
          const account = await ctx.context.adapter.findOne<{
            accountId: string;
          }>({
            model: "account",
            where: [
              { field: "userId", value: currentSession.user.id },
              { field: "providerId", value: "atproto" },
            ],
          });

          if (!account) {
            return ctx.json(
              { error: "No ATProto account linked" },
              { status: 404 }
            );
          }

          const client = await getOAuthClient(ctx.context.adapter, ctx.context.baseURL);

          try {
            // Restore the session - this also handles token refresh
            const atprotoSession = await client.restore(account.accountId);

            return ctx.json({
              did: atprotoSession.did,
              active: true,
            });
          } catch (error) {
            return ctx.json(
              {
                error: "Failed to restore ATProto session",
                details: error instanceof Error ? error.message : "Unknown error",
              },
              { status: 400 }
            );
          }
        }
      ),
    },
  };
}

// Type for the database adapter (simplified for our use)
interface DatabaseAdapter {
  findOne<T>(options: {
    model: string;
    where: Array<{ field: string; value: unknown }>;
  }): Promise<T | null>;
  create(options: { model: string; data: Record<string, unknown> }): Promise<unknown>;
  update(options: {
    model: string;
    where: Array<{ field: string; value: unknown }>;
    update: Record<string, unknown>;
  }): Promise<unknown>;
  delete(options: {
    model: string;
    where: Array<{ field: string; value: unknown }>;
  }): Promise<unknown>;
}

export type { AtprotoAuthOptions };