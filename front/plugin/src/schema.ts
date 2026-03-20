/**
 * Database schema definitions for the ATProto better-auth plugin.
 * These tables store OAuth state and session data required by @atproto/oauth-client-node.
 */

/**
 * Schema extensions for the user table.
 * Adds ATProto-specific fields to store profile data.
 */
export const atprotoUserSchema = {
    user: {
      fields: {
        atprotoDid: {
          type: "string",
          required: false,
          unique: true,
        },
        atprotoHandle: {
          type: "string",
          required: false,
        },
        atprotoBio: {
          type: "string",
          required: false,
        },
        atprotoBanner: {
          type: "string",
          required: false,
        },
      },
    },
  } as const;
  
  /**
   * Schema for the atprotoState table.
   * Stores temporary OAuth state during the authorization flow.
   */
  export const atprotoStateSchema = {
    atprotoState: {
      fields: {
        key: {
          type: "string",
          required: true,
          unique: true,
        },
        state: {
          type: "string",
          required: true,
        },
        expiresAt: {
          type: "date",
          required: true,
        },
      },
    },
  } as const;
  
  /**
   * Schema for the atprotoSession table.
   * Stores ATProto OAuth sessions including tokens, DPoP keys, etc.
   * This is separate from better-auth's session table because ATProto
   * sessions contain additional cryptographic material needed for API calls.
   */
  export const atprotoSessionSchema = {
    atprotoSession: {
      fields: {
        did: {
          type: "string",
          required: true,
          unique: true,
        },
        session: {
          type: "string",
          required: true,
        },
        userId: {
          type: "string",
          required: true,
          references: {
            model: "user",
            field: "id",
          },
        },
        updatedAt: {
          type: "date",
          required: true,
        },
      },
    },
  } as const;
  
  /**
   * Combined schema for the plugin
   */
  export const atprotoSchema = {
    ...atprotoUserSchema,
    ...atprotoStateSchema,
    ...atprotoSessionSchema,
  } as const;