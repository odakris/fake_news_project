"use client";

import { useState } from "react";
import { useSession, signOut, authClient } from "@/lib/auth-client";

// Extend the session user type to include ATProto fields
interface AtprotoUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  atprotoDid?: string;
  atprotoHandle?: string;
  atprotoBio?: string;
  atprotoBanner?: string;
}

export default function Home() {
  const { data: session, isPending } = useSession();
  const [handle, setHandle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Cast to include ATProto fields
  const user = session?.user as AtprotoUser | undefined;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle.trim()) return;

    setIsLoading(true);
    try {
      await authClient.signIn.atproto({
        handle: handle.trim(),
        callbackURL: "/",
      });
    } catch (error) {
      console.error("Sign in error:", error);
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ATProto Better-Auth
            </h1>
            <p className="text-gray-600">Sign in with your Bluesky account</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {user ? (
              // Signed in state
              <div>
                {/* Banner */}
                {user.atprotoBanner ? (
                  <div
                    className="h-32 bg-cover bg-center"
                    style={{ backgroundImage: `url(${user.atprotoBanner})` }}
                  />
                ) : (
                  <div className="h-32 bg-linear-to-r from-blue-400 to-indigo-500" />
                )}

                {/* Profile section */}
                <div className="px-6 pb-6">
                  {/* Avatar - overlapping banner */}
                  <div className="-mt-12 mb-4">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name || "Profile"}
                        className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center">
                        <span className="text-2xl text-gray-500">
                          {user.name?.charAt(0) || "?"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Name and handle */}
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-gray-900">
                      {user.name}
                    </h2>
                    {user.atprotoHandle && (
                      <p className="text-blue-500 text-sm">
                        @{user.atprotoHandle}
                      </p>
                    )}
                  </div>

                  {/* Bio */}
                  {user.atprotoBio && (
                    <p className="text-gray-600 text-sm mb-4">
                      {user.atprotoBio}
                    </p>
                  )}

                  {/* DID */}
                  {user.atprotoDid && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-xs text-gray-500 mb-1">DID</p>
                      <p
                        className="text-xs font-mono text-gray-700 truncate"
                        title={user.atprotoDid}
                      >
                        {user.atprotoDid}
                      </p>
                    </div>
                  )}

                  {/* Sign out button */}
                  <button
                    onClick={handleSignOut}
                    className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              // Sign in form
              <div className="p-8">
                <form onSubmit={handleSignIn} className="space-y-6">
                  <div>
                    <label
                      htmlFor="handle"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Bluesky Handle
                    </label>
                    <input
                      type="text"
                      id="handle"
                      value={handle}
                      onChange={(e) => setHandle(e.target.value)}
                      placeholder="username.bsky.social"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-400"
                      disabled={isLoading}
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Enter your full Bluesky handle (e.g., alice.bsky.social)
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !handle.trim()}
                    className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Connecting...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 600 530"
                          fill="currentColor"
                        >
                          <path d="m135.72 44.03c66.496 49.921 138.02 151.14 164.28 205.46 26.262-54.316 97.782-155.54 164.28-205.46 47.98-36.021 125.72-63.892 125.72 24.795 0 17.712-10.155 148.79-16.111 170.07-20.703 73.984-96.144 92.854-163.25 81.433 117.3 19.964 147.14 86.092 82.697 152.22-122.39 125.59-175.91-31.511-189.63-71.766-2.514-7.3797-3.6904-10.832-3.7077-7.8964-0.0174-2.9357-1.1937 0.51669-3.7077 7.8964-13.714 40.255-67.233 197.36-189.63 71.766-64.444-66.128-34.605-132.26 82.697-152.22-67.108 11.421-142.55-7.4491-163.25-81.433-5.9562-21.282-16.111-152.36-16.111-170.07 0-88.687 77.742-60.816 125.72-24.795z" />
                        </svg>
                        Sign in with Bluesky
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-8">
            <a
              href="https://github.com/AugusDogus/atproto-better-auth"
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            {" · "}
            Powered by{" "}
            <a
              href="https://better-auth.com"
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              better-auth
            </a>
            {" + "}
            <a
              href="https://atproto.com"
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              ATProto
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}