/**
 * ATProto Better-Auth Plugin
 * 
 * A better-auth plugin for authenticating with ATProto/Bluesky.
 * 
 * @example
 * ```ts
 * import { betterAuth } from "better-auth";
 * import { atprotoAuth } from "atproto-better-auth";
 * 
 * export const auth = betterAuth({
 *   plugins: [
 *     atprotoAuth({
 *       clientMetadata: {
 *         clientId: "https://myapp.com/client-metadata.json",
 *         clientName: "My App",
 *         redirectUris: ["https://myapp.com/api/auth/callback/atproto"],
 *       },
 *       privateKey: JSON.parse(process.env.ATPROTO_PRIVATE_KEY!),
 *     }),
 *   ],
 * });
 * ```
 */

// Main plugin export
export { atprotoAuth } from "./server";

// Schema exports
export { atprotoSchema, atprotoUserSchema, atprotoStateSchema, atprotoSessionSchema } from "./schema";

// Type exports
export type {
  AtprotoAuthOptions,
  AtprotoClientMetadata,
  AtprotoClientMetadataInput,
  AtprotoProfile,
  AtprotoSessionInfo,
  AtprotoSignInParams,
  AtprotoStateRecord,
  AtprotoSessionRecord,
  ES256PrivateJwk,
  ES256PublicJwk,
} from "./types";

// Utility exports
export {
  getPublicJwk,
  createJwks,
  createClientMetadata,
  generateES256Key,
  isValidES256PrivateKey,
  createClientMetadataHandler,
  createJwksHandler,
  DEFAULT_ATPROTO_SCOPES,
} from "./utils";

export type { CreateClientMetadataOptions } from "./utils";