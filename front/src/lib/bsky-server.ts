import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import type { AtpPersistSessionHandler } from "@atproto/api";
import {
  createAuthenticatedAgent,
  isAtprotoAccessTokenStale,
  refreshAtprotoSession,
  type AtprotoSessionData,
} from "@/lib/bsky";
import { prisma } from "@/lib/prisma";

export async function getServerSession() {
  return auth.api.getSession({ headers: await headers() });
}

/** Charge les tokens ATProto depuis la DB (le refresh token n'est pas dans la session Better Auth). */
async function getAtprotoDataForUser(
  userId: string,
): Promise<AtprotoSessionData | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      did: true,
      handle: true,
      atprotoAccessToken: true,
      atprotoRefreshToken: true,
    },
  });

  if (!user?.did || !user.atprotoAccessToken) return null;

  return {
    did: user.did,
    handle: user.handle,
    atprotoAccessToken: user.atprotoAccessToken,
    atprotoRefreshToken: user.atprotoRefreshToken,
  };
}

function createPersistSessionHandler(userId: string): AtpPersistSessionHandler {
  return async (evt, atpSession) => {
    if ((evt !== "create" && evt !== "update") || !atpSession) return;

    await prisma.user.update({
      where: { id: userId },
      data: {
        atprotoAccessToken: atpSession.accessJwt,
        atprotoRefreshToken: atpSession.refreshJwt,
      },
    });
  };
}

/** Rafraîchit explicitement la session ATProto et persiste les nouveaux tokens. */
export async function refreshServerAtprotoSession() {
  const session = await getServerSession();
  if (!session?.user) redirect("/login");

  const atprotoData = await getAtprotoDataForUser(session.user.id);
  if (!atprotoData?.atprotoRefreshToken) redirect("/login");

  try {
    return await refreshAtprotoSession(atprotoData, {
      persistSession: createPersistSessionHandler(session.user.id),
    });
  } catch {
    redirect("/login");
  }
}

export async function getServerAgent() {
  const session = await getServerSession();
  if (!session?.user) redirect("/login");

  const atprotoData = await getAtprotoDataForUser(session.user.id);
  if (!atprotoData) redirect("/login");

  if (isAtprotoAccessTokenStale(atprotoData.atprotoAccessToken)) {
    return refreshServerAtprotoSession();
  }

  const { agent } = createAuthenticatedAgent(atprotoData, {
    persistSession: createPersistSessionHandler(session.user.id),
  });

  return agent;
}

