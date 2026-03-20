import type { User } from "better-auth";
import type { NodeOAuthClientOptions } from "@atproto/oauth-client-node";

/**
 * ES256 JSON Web Key with private key component
 */
export interface ES256PrivateJwk {
  kty: "EC";
  crv: "P-256";
  x: string;
  y: string;
  d: string; // Private key component
  alg?: "ES256";
  kid?: string;
}

/**
 * ES256 JSON Web Key (public only, for JWKS endpoint)
 */
export interface ES256PublicJwk {
  kty: "EC";
  crv: "P-256";
  x: string;
  y: string;
  alg?: "ES256";
  kid?: string;
}

/**
 * OAuth client metadata that must be served at the clientId URL
 */
export interface AtprotoClientMetadata {
  client_id: string;
  client_name: string;
  client_uri?: string;
  logo_uri?: string;
  tos_uri?: string;
  policy_uri?: string;
  redirect_uris: string[];
  grant_types: ["authorization_code", "refresh_token"];
  response_types: ["code"];
  scope: string;
  dpop_bound_access_tokens: true;
  application_type: "web" | "native";
  token_endpoint_auth_method: "private_key_jwt" | "none";
  token_endpoint_auth_signing_alg?: "ES256";
  jwks_uri?: string;
}

/**
 * ATProto user profile information
 */
export interface AtprotoProfile {
  did: string;
  handle: string;
  displayName?: string;
  avatar?: string;
  description?: string;
  banner?: string;
}

/**
 * Client metadata input with required URLs.
 * Used for utility functions like createClientMetadata() where URLs cannot be auto-derived.
 */
export interface AtprotoClientMetadataInput {
  /**
   * Human-readable name of your application
   */
  clientName: string;

  /**
   * The URL where your client-metadata.json is hosted.
   * This becomes your OAuth client_id.
   */
  clientId: string;

  /**
   * Homepage URL for your application.
   */
  clientUri?: string;

  /**
   * URL to your application's logo
   */
  logoUri?: string;

  /**
   * URL to your terms of service
   */
  tosUri?: string;

  /**
   * URL to your privacy policy
   */
  policyUri?: string;

  /**
   * OAuth redirect URIs. Should include your callback endpoint.
   */
  redirectUris: string[];

  /**
   * OAuth scopes to request. Defaults to "atproto transition:generic"
   */
  scope?: string;

  /**
   * URL where your JWKS (public keys) are hosted.
   * Required for confidential (web service) clients.
   */
  jwksUri?: string;
}

/**
 * Plugin configuration options
 */
export interface AtprotoAuthOptions {
  /**
   * Client metadata configuration.
   * URLs are automatically derived from Better Auth's baseURL unless explicitly set.
   */
  clientMetadata: {
    /**
     * Human-readable name of your application
     */
    clientName: string;

    /**
     * The URL where your client-metadata.json is hosted.
     * This becomes your OAuth client_id.
     * Defaults to `{baseURL}/client-metadata.json`
     */
    clientId?: string;

    /**
     * Homepage URL for your application.
     * Defaults to Better Auth's baseURL (with /api/auth stripped).
     */
    clientUri?: string;

    /**
     * URL to your application's logo
     */
    logoUri?: string;

    /**
     * URL to your terms of service
     */
    tosUri?: string;

    /**
     * URL to your privacy policy
     */
    policyUri?: string;

    /**
     * OAuth redirect URIs. Should include your callback endpoint.
     * Defaults to `[{baseURL}/callback/atproto]`
     */
    redirectUris?: string[];

    /**
     * OAuth scopes to request. Defaults to "atproto transition:generic"
     */
    scope?: string;

    /**
     * URL where your JWKS (public keys) are hosted.
     * Required for confidential (web service) clients.
     * Defaults to `{appBaseURL}/jwks.json`
     */
    jwksUri?: string;
  };

  /**
   * ES256 private key in JWK format.
   * Must include the "d" (private key) component.
   * Generate at https://jwkset.com/generate with:
   * - Key type: ECDSA
   * - Key algorithm: ES256
   * - Key use: Signature
   */
  privateKey: ES256PrivateJwk;

  /**
   * Map ATProto profile to user fields during account creation/linking
   */
  mapProfileToUser?: (profile: AtprotoProfile) => Partial<User>;

  /**
   * Custom NodeOAuthClient options for advanced configuration.
   * Merged with generated options from clientMetadata.
   */
  oauthClientOptions?: Partial<NodeOAuthClientOptions>;
}

/**
 * Stored OAuth state during authorization flow
 */
export interface AtprotoStateRecord {
  key: string;
  state: string; // Serialized NodeSavedState
  expiresAt: Date;
}

/**
 * Stored ATProto OAuth session
 */
export interface AtprotoSessionRecord {
  did: string;
  session: string; // Serialized NodeSavedSession
  userId: string;
  updatedAt: Date;
}

/**
 * ATProto session info returned to client
 */
export interface AtprotoSessionInfo {
  did: string;
  handle: string;
  displayName?: string;
  avatar?: string;
  active: boolean;
}

/**
 * Sign-in request parameters
 */
export interface AtprotoSignInParams {
  /**
   * The user's ATProto handle (e.g., "user.bsky.social")
   */
  handle: string;

  /**
   * URL to redirect to after successful authentication
   */
  callbackURL?: string;
}