import type { BetterAuthClientPlugin } from "better-auth/client";
import type { AtprotoSessionInfo, AtprotoSignInParams } from "./types";
import type { atprotoAuth } from "./server";

/**
 * Client-side ATProto authentication plugin for better-auth.
 */
export const atprotoAuthClient = () => {
  return {
    id: "atproto",
    $InferServerPlugin: {} as ReturnType<typeof atprotoAuth>,

    getActions($fetch) {
      return {
        /**
         * Sign in with ATProto/Bluesky
         */
        signIn: {
          atproto: async (params: AtprotoSignInParams) => {
            const { handle, callbackURL } = params;

            // Build the sign-in URL with query parameters
            const searchParams = new URLSearchParams({ handle });
            if (callbackURL) {
              searchParams.set("callbackURL", callbackURL);
            }

            // Redirect to the sign-in endpoint (browser environment)
            if (typeof window !== "undefined") {
              window.location.href = `/api/auth/atproto/sign-in?${searchParams.toString()}`;
            }
          },
        },

        atproto: {
          /**
           * Get the current ATProto session information
           */
          getSession: async (): Promise<{ session: AtprotoSessionInfo | null }> => {
            const response = await $fetch<{ session: AtprotoSessionInfo | null }>("/atproto/session", {
              method: "GET",
            });

            if (!response.data) {
              return { session: null };
            }

            return response.data;
          },

          /**
           * Restore/refresh the ATProto session
           * Useful to ensure the session is valid before making API calls
           */
          restore: async (): Promise<{ did: string; active: boolean } | { error: string }> => {
            const response = await $fetch<{ did: string; active: boolean } | { error: string }>("/atproto/restore", {
              method: "POST",
            });

            if (!response.data) {
              return { error: response.error?.message ?? "Unknown error" };
            }

            return response.data;
          },
        },
      };
    },

    // Path prefixes for the plugin's endpoints
    pathMethods: {
      "/atproto/sign-in": "GET",
      "/callback/atproto": "GET",
      "/atproto/session": "GET",
      "/atproto/restore": "POST",
    },
  } satisfies BetterAuthClientPlugin;
};

// Re-export types for client consumers
export type { AtprotoSessionInfo, AtprotoSignInParams };