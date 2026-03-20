import type {
    ES256PrivateJwk,
    ES256PublicJwk,
    AtprotoClientMetadata,
    AtprotoClientMetadataInput,
  } from "./types";
  
  /**
   * Extracts the public key from an ES256 private JWK.
   * Use this to create your JWKS endpoint content.
   * 
   * @param privateKey - The ES256 private key in JWK format
   * @returns The public key in JWK format (without the "d" component)
   */
  export function getPublicJwk(privateKey: ES256PrivateJwk): ES256PublicJwk {
    const { d: _privateComponent, ...publicKey } = privateKey;
    return publicKey as ES256PublicJwk;
  }
  
  /**
   * Creates a JWKS (JSON Web Key Set) object from a private key.
   * This is what should be served at your /jwks.json endpoint.
   * 
   * @param privateKey - The ES256 private key in JWK format
   * @returns A JWKS object with the public key
   */
  export function createJwks(privateKey: ES256PrivateJwk): { keys: ES256PublicJwk[] } {
    return {
      keys: [getPublicJwk(privateKey)],
    };
  }
  
  /**
   * Options for createClientMetadata utility function.
   */
  export interface CreateClientMetadataOptions {
    clientMetadata: AtprotoClientMetadataInput;
    privateKey: ES256PrivateJwk;
  }
  
  /**
   * Creates the client metadata object for the /client-metadata.json endpoint.
   * 
   * @param options - The client metadata and private key
   * @returns The client metadata object to serve at your clientId URL
   */
  export function createClientMetadata(
    options: CreateClientMetadataOptions
  ): AtprotoClientMetadata {
    const { clientMetadata } = options;
    const hasJwks = !!clientMetadata.jwksUri;
  
    return {
      client_id: clientMetadata.clientId,
      client_name: clientMetadata.clientName,
      client_uri: clientMetadata.clientUri,
      logo_uri: clientMetadata.logoUri,
      tos_uri: clientMetadata.tosUri,
      policy_uri: clientMetadata.policyUri,
      redirect_uris: clientMetadata.redirectUris,
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      scope: clientMetadata.scope ?? "atproto transition:generic",
      dpop_bound_access_tokens: true,
      application_type: "web",
      token_endpoint_auth_method: hasJwks ? "private_key_jwt" : "none",
      token_endpoint_auth_signing_alg: hasJwks ? "ES256" : undefined,
      jwks_uri: clientMetadata.jwksUri,
    };
  }
  
  /**
   * Generates a new ES256 key pair for ATProto OAuth.
   * 
   * Note: This uses the Web Crypto API which is available in Node.js 15+
   * and modern browsers. For older environments, use a library like jose.
   * 
   * @returns A promise that resolves to an ES256 private key in JWK format
   */
  export async function generateES256Key(): Promise<ES256PrivateJwk> {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: "ECDSA",
        namedCurve: "P-256",
      },
      true, // extractable
      ["sign", "verify"]
    );
  
    const privateJwk = await crypto.subtle.exportKey("jwk", keyPair.privateKey);
  
    return {
      kty: "EC",
      crv: "P-256",
      x: privateJwk.x!,
      y: privateJwk.y!,
      d: privateJwk.d!,
      alg: "ES256",
      kid: crypto.randomUUID(),
    };
  }
  
  /**
   * Validates that a JWK has all required fields for an ES256 private key.
   * 
   * @param jwk - The JWK to validate
   * @returns True if the JWK is a valid ES256 private key
   */
  export function isValidES256PrivateKey(jwk: unknown): jwk is ES256PrivateJwk {
    if (!jwk || typeof jwk !== "object") return false;
  
    const key = jwk as Record<string, unknown>;
  
    return (
      key.kty === "EC" &&
      key.crv === "P-256" &&
      typeof key.x === "string" &&
      typeof key.y === "string" &&
      typeof key.d === "string"
    );
  }
  
  /**
   * Helper to create a Next.js API route handler for /client-metadata.json
   * 
   * @example
   * ```ts
   * // app/client-metadata.json/route.ts
   * import { createClientMetadataHandler } from "atproto-better-auth/utils";
   * 
   * export const GET = createClientMetadataHandler({
   *   clientMetadata: {
   *     clientId: "https://example.com/client-metadata.json",
   *     clientName: "My App",
   *     redirectUris: ["https://example.com/api/auth/callback/atproto"],
   *     jwksUri: "https://example.com/jwks.json",
   *   },
   *   privateKey,
   * });
   * ```
   */
  export function createClientMetadataHandler(options: CreateClientMetadataOptions) {
    const metadata = createClientMetadata(options);
  
    return () => {
      return new Response(JSON.stringify(metadata), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    };
  }
  
  /**
   * Helper to create a Next.js API route handler for /jwks.json
   * 
   * @example
   * ```ts
   * // app/jwks.json/route.ts
   * import { createJwksHandler } from "atproto-better-auth/utils";
   * import { authOptions } from "@/lib/auth";
   * 
   * export const GET = createJwksHandler(authOptions.privateKey);
   * ```
   */
  export function createJwksHandler(privateKey: ES256PrivateJwk) {
    const jwks = createJwks(privateKey);
  
    return () => {
      return new Response(JSON.stringify(jwks), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    };
  }
  
  /**
   * Default scopes for ATProto OAuth.
   * - atproto: Required for all ATProto OAuth requests
   * - transition:generic: Transitional scope for general API access
   */
  export const DEFAULT_ATPROTO_SCOPES = "atproto transition:generic";