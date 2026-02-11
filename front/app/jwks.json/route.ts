import { createJwksHandler } from "atproto-better-auth";
import { env } from "@/lib/env";

const privateKey = JSON.parse(env.ATPROTO_PRIVATE_KEY);

export const GET = createJwksHandler(privateKey);