"use client";

// In your component/page
import { authClient } from "@/src/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

type AtprotoSession = Awaited<ReturnType<typeof authClient.atproto.getSession>>["session"];

export function SignInButton() {

  const [session, setSession] = useState<AtprotoSession | null>(null);

  useEffect(() => {
    authClient.atproto.getSession().then((session) => {
      console.log("session", session.session);
      setSession(session.session);
    });
  }, []);
  

  const handleSignIn = () => {
    authClient.signIn.atproto({
      handle: "h-ant.bsky.social", // The user's Bluesky handle
      callbackURL: "/",  // Where to redirect after auth
    });
  };

  return <button onClick={handleSignIn}>Sign in with Bluesky</button>;
}