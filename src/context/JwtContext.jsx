/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { setJwtToken } from "@/lib/fetchWithAuth";

const JwtContext = createContext({
  jwt: null,
  setJwt: () => {},
});

export function JwtProvider({ children }) {
  const { data: sessionData, isPending } = useSession();
  const [jwt, setJwtState] = useState(null);

  // Sync token whenever session loads or changes
  useEffect(() => {
    let active = true;

    async function fetchToken() {
      try {
        const res = await fetch("/api/auth/token", { method: "POST" });
        if (res.ok) {
          const data = await res.json();
          if (active && data.token) {
            setJwtState(data.token);
            setJwtToken(data.token);
          }
        }
      } catch (error) {
        console.error("Failed to fetch JWT token:", error);
      }
    }

    if (sessionData?.user) {
      fetchToken();
    } else if (!isPending && !sessionData) {
      // Clear token if loading completed and no session is found
      setJwtState(null);
      setJwtToken(null);
    }

    return () => {
      active = false;
    };
  }, [sessionData, isPending]);

  return (
    <JwtContext.Provider value={{ jwt, setJwt: (token) => {
      setJwtState(token);
      setJwtToken(token);
    } }}>
      {children}
    </JwtContext.Provider>
  );
}

export function useJwt() {
  const context = useContext(JwtContext);
  if (context === undefined) {
    throw new Error("useJwt must be used within a JwtProvider");
  }
  return context.jwt;
}
