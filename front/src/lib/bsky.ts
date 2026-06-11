import {
  Agent,
  CredentialSession,
  type AtpPersistSessionHandler,
} from "@atproto/api";
import { APIError } from "better-auth";

const BSKY_SERVICE = "https://api.bsky.social";
export const publicAgent = new Agent({ service: BSKY_SERVICE });

/** @deprecated Utilisez `publicAgent` ou `createAuthenticatedAgent`. */
export const agent = publicAgent;

export type AtprotoSessionData = {
  did: string;
  handle?: string | null;
  atprotoAccessToken: string;
  atprotoRefreshToken?: string | null;
};

export type CreateAuthenticatedAgentOptions = {
  persistSession?: AtpPersistSessionHandler;
};

function toAtpSessionData(session: AtprotoSessionData) {
  return {
    did: session.did,
    handle: session.handle ?? session.did,
    accessJwt: session.atprotoAccessToken,
    refreshJwt: session.atprotoRefreshToken ?? "",
    active: true as const,
  };
}

export function createAuthenticatedAgent(
  session: AtprotoSessionData,
  options?: CreateAuthenticatedAgentOptions,
) {
  const credentialSession = new CredentialSession(
    new URL(BSKY_SERVICE),
    undefined,
    options?.persistSession,
  );
  credentialSession.session = toAtpSessionData(session);

  return {
    agent: new Agent(credentialSession),
    credentialSession,
  };
}

/** Rafraîchit la session ATProto via `com.atproto.server.refreshSession`. */
export async function refreshAtprotoSession(
  session: AtprotoSessionData,
  options?: CreateAuthenticatedAgentOptions,
) {
  if (!session.atprotoRefreshToken) {
    throw APIError.from("UNAUTHORIZED", {
      code: "MISSING_ATPROTO_REFRESH_TOKEN",
      message: "Missing ATProto refresh token",
    });
  }

  const { agent, credentialSession } = createAuthenticatedAgent(
    session,
    options,
  );

  await credentialSession.resumeSession(toAtpSessionData(session));

  return agent;
}
function getJwtExpiry(token: string): number | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const decoded = JSON.parse(
      Buffer.from(
        payload.replace(/-/g, "+").replace(/_/g, "/"),
        "base64",
      ).toString(),
    ) as { exp?: number };
    return typeof decoded.exp === "number" ? decoded.exp : null;
  } catch {
    return null;
  }
}

/** Vrai si l'access token est expiré ou expire dans les prochaines secondes. */
export function isAtprotoAccessTokenStale(
  accessToken: string,
  bufferSeconds = 120,
): boolean {
  const exp = getJwtExpiry(accessToken);
  if (!exp) return true;
  return Date.now() >= (exp - bufferSeconds) * 1000;
}

export function sessionUserToAtprotoData(user: {
  did?: string | null;
  handle?: string | null;
  atprotoAccessToken?: string | null;
  atprotoRefreshToken?: string | null;
}): AtprotoSessionData | null {
  if (!user.did || !user.atprotoAccessToken) return null;
  return {
    did: user.did,
    handle: user.handle,
    atprotoAccessToken: user.atprotoAccessToken,
    atprotoRefreshToken: user.atprotoRefreshToken,
  };
}
