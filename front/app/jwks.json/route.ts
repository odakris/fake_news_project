import { createJwks } from "atproto-better-auth";
import { privateKey } from "@/lib/auth";

export async function GET() {
  const jwks = createJwks(privateKey);

  return Response.json(jwks, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}