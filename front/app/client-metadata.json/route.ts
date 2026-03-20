import { createClientMetadata } from "atproto-better-auth";
import { privateKey } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  // Derive base URL from request or env
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const proto = headersList.get("x-forwarded-proto") ?? "http";
  const baseURL = process.env.BETTER_AUTH_URL ?? `${proto}://${host}`;

  const metadata = createClientMetadata({
    clientMetadata: {
      clientId: `${baseURL}/client-metadata.json`,
      clientName: "ATProto Better-Auth Example",
      clientUri: baseURL,
      redirectUris: [`${baseURL}/api/auth/callback/atproto`],
      jwksUri: `${baseURL}/jwks.json`,
    },
    privateKey,
  });

  return Response.json(metadata, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}