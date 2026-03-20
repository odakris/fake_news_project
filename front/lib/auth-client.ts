import { createAuthClient } from "better-auth/react";
import { atprotoAuthClient } from "@/plugin/src/client";
import { getBaseUrl } from "./base-url";

export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
  plugins: [atprotoAuthClient()],
});

export const { useSession, signOut } = authClient;