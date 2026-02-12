import { createAuthClient } from "better-auth/react";
import { getBaseUrl } from "./base-url";

export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    scheme: "fakenewsproject",
    baseURL: getBaseUrl(),
    plugins: []
});