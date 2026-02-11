"use client";

// In your component/page
import { authClient } from "@/lib/auth-client";

export function SignInButton() {
  const handleSignIn = () => {
    authClient.signIn.atproto({
      handle: "h-ant.bsky.social", // The user's Bluesky handle
      callbackURL: "/",  // Where to redirect after auth
    });
  };

  return <button onClick={handleSignIn}>Sign in with Bluesky</button>;
}