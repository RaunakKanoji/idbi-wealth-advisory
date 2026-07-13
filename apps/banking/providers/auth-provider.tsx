"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type AuthStatus = "loading" | "signed-in" | "signed-out";

interface AuthContextValue {
  status: AuthStatus;
  signIn: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Demo session key (F007). A real bank IdP replaces this provider's internals —
 *  the interface and the route gating stay the same. */
const SESSION_KEY = "idbi.demo.session";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    try {
      setStatus(window.localStorage.getItem(SESSION_KEY) ? "signed-in" : "signed-out");
    } catch {
      setStatus("signed-out");
    }
  }, []);

  const signIn = useCallback(() => {
    try {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify({ customerId: "cust-demo-001" }));
    } catch {
      // Secure storage unavailable (device-capability-context.md): session-scoped only.
    }
    setStatus("signed-in");
  }, []);

  const signOut = useCallback(() => {
    try {
      window.localStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore
    }
    setStatus("signed-out");
  }, []);

  return <AuthContext.Provider value={{ status, signIn, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AuthProvider");
  return value;
}
