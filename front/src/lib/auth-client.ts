import { createAuthClient } from "better-auth/react";
import {
  inferAdditionalFields,
  usernameClient,
} from "better-auth/client/plugins";
import type { auth } from "@/lib/auth";
import { createAuthenticatedAgent } from "@/lib/bsky";

export const authClient = createAuthClient({
  plugins: [usernameClient(), inferAdditionalFields<typeof auth>()],
});

export const { signIn, signOut, signUp, useSession, getSession } = authClient;

export type AtprotoUser = NonNullable<
  ReturnType<typeof useSession>["data"]
>["user"];

export type SignInAtprotoResponse = {
  redirect: boolean;
  token: string;
  url?: string;
  user: AtprotoUser;
  atproto?: {
    did: string;
    handle: string;
  };
};

export async function signInAtproto(params: {
  identifier: string;
  password: string;
  rememberMe?: boolean;
  callbackURL?: string;
}) {
  return authClient.$fetch<SignInAtprotoResponse>("/sign-in/atproto", {
    method: "POST",
    body: params,
  });
}

export function getClientAgentFromSession(
  user: AtprotoUser | null | undefined,
) {
  if (!user?.did || !user.atprotoAccessToken) return null;
  return createAuthenticatedAgent({
    did: user.did,
    handle: user.handle,
    atprotoAccessToken: user.atprotoAccessToken,
  }).agent;
}
