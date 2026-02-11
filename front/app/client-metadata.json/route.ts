import { createClientMetadataHandler } from "atproto-better-auth";
import { env } from "@/lib/env";


const privateKey = JSON.parse(env.ATPROTO_PRIVATE_KEY);
const baseUrl = env.BETTER_AUTH_URL;

const options = {
  clientMetadata: {
    clientId: `${baseUrl}/client-metadata.json`,
    clientName: "Fake News Project",
    redirectUris: [`${baseUrl}/api/auth/callback/atproto`],
    jwksUri: `${baseUrl}/jwks.json`,
  },
  privateKey,
};

export const GET = createClientMetadataHandler(options);