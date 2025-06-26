'use client'

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { authClient } from "@repo/auth";

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

export default function Home() {
    const [session, setSession] = useState<SessionData>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in
        const checkSession = async () => {
            try {
                const {data} = await authClient.getSession();
                // Transform the session data if needed to match our SessionData type
                if (data) {
                    console.log(data.user)
                    setSession({
                        user: {
                            id: data.user.id || '',
                            name: data.user.name || null,
                            email: data.user.email || null,
                            image: data.user.image || null
                        }
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
        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const signIn = async () => {
        try {
            await authClient.signIn.social({
                provider: "github",
            });
            // Session will be updated via the storage event listener
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
            <div className={styles.loadingContainer || 'flex items-center justify-center min-h-screen'}>
                <div className={styles.loadingSpinner || 'animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent'}></div>
                <p className="ml-3">Loading...</p>
            </div>
        );
    }

    return (
        <div className={styles.container || 'flex items-center justify-center min-h-screen bg-gray-50'}>
            <div className={styles.card || 'bg-white p-8 rounded-lg shadow-lg max-w-md w-full'}>
                <h1 className={styles.title || 'text-3xl font-bold text-center text-blue-600'}>PeeBuddy</h1>
                <p className={styles.subtitle || 'text-center text-gray-600 mb-6'}>Your personal bathroom finder</p>
                
                {session ? (
                    <div className={styles.userSection || 'space-y-6'}>
                        <div className={styles.welcomeMessage || 'text-center'}>
                            <h2 className="text-xl font-semibold">Welcome, {session.user.name || 'User'}!</h2>
                            <p className="text-gray-600">{session.user.email || 'GitHub user'}</p>
                        </div>
                        <div className={styles.actionButtons || 'flex flex-col space-y-3'}>
                            <button 
                                className={styles.primaryButton || 'bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors w-full'} 
                                onClick={() => window.location.href = '/dashboard'}
                            >
                                Go to Dashboard
                            </button>
                            <button 
                                className={styles.secondaryButton || 'bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition-colors w-full'} 
                                onClick={signOut}
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={styles.loginSection || 'space-y-6'}>
                        <p className={styles.loginText || 'text-center text-gray-700'}>Sign in to find and rate bathrooms near you</p>
                        <button 
                            className={styles.githubButton || 'flex items-center justify-center bg-gray-800 hover:bg-gray-900 text-white py-2 px-4 rounded-md transition-colors w-full gap-2'} 
                            onClick={signIn}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            Sign in with GitHub
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
