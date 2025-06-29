"use client";

import { useState, useEffect } from "react";
import { authClient } from "@workspace/auth";

// Define the user type based on the Better Auth API
type User = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

// Define our own session type since the imported one might not match
type SessionData = {
  user: User;
} | null;

export default function Auth({ providers }: { providers: string[] }) {
  const [session, setSession] = useState<SessionData>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      try {
        const { data } = await authClient.getSession();
        // Transform the session data if needed to match our SessionData type
        if (data) {
          console.log(data.user);
          setSession({
            user: {
              id: data.user.id || "",
              name: data.user.name || null,
              email: data.user.email || null,
              image: data.user.image || null,
            },
          });
        }
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Set up event listener for auth state changes if available
    const handleStorageChange = () => {
      checkSession();
    };

    // Listen for auth changes via localStorage events
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const signIn = async (provider: string) => {
    try {
      await authClient.signIn.social({
        provider: provider,
      });
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  const signOut = async () => {
    try {
      if (authClient.signOut) {
        await authClient.signOut();
      }
      setSession(null);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (loading) {
    return (
      <div className={"flex items-center justify-center min-h-screen"}>
        <div
          className={
            "animate-spin h-10 w-10 border-4 border-amber-500 rounded-full border-t-transparent"
          }
        ></div>
        <p className="ml-3 text-amber-900">Loading...</p>
      </div>
    );
  }

  return (
    <div className={"flex items-center justify-center min-h-screen"}>
      <div className={"bg-white p-8 rounded-lg shadow-lg max-w-md w-full border border-amber-200"}>
        <h1 className={"text-3xl font-bold text-center text-amber-600"}>
          PeeBuddy
        </h1>
        <p className={"text-center text-amber-700 mb-6"}>
          Your personal bathroom finder
        </p>

        {session ? (
          <div className={"space-y-6"}>
            <div className={"text-center"}>
              <h2 className="text-xl font-semibold text-amber-900">
                Welcome, {session.user.name || "User"}!
              </h2>
              <p className="text-amber-700">
                {session.user.email || "GitHub user"}
              </p>
            </div>
            <div className={"flex flex-col space-y-3"}>
              <button
                className={
                  "bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-md transition-colors w-full"
                }
                onClick={() => (window.location.href = "/dashboard")}
              >
                Go to Dashboard
              </button>
              <button
                className={
                  "bg-amber-100 hover:bg-amber-200 text-amber-800 py-2 px-4 rounded-md transition-colors w-full border border-amber-300"
                }
                onClick={signOut}
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div className={"space-y-6"}>
            <p className={"text-center text-amber-700"}>
              Sign in to find and rate bathrooms near you
            </p>
            {
              providers.map((provider) => (
                <button
                  key={provider}
                  className={
                    "flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-md transition-colors w-full gap-2 capitalize"
                  }
                  onClick={() => signIn(provider)}
                >
                  Sign in with {provider}
                </button>
              ))
            }
          </div>
        )}
      </div>
    </div>
  );
}
