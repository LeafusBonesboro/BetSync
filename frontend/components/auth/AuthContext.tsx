"use client";

import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  user: any;
  setUser: (user: any) => void;
  loading: boolean;
  logout: () => void; // 🔥 ADD LOGOUT TO TYPE
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: true,
  logout: () => {}, // 🔥 PROVIDE DEFAULT
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // LOAD USER ON PAGE LOAD (USING COOKIE)
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
          {
            credentials: "include", // 🔥 SEND COOKIE TO BACKEND
          }
        );

        if (!res.ok) {
          setUser(null);
        } else {
          const data = await res.json();
          setUser(data);
        }
      } catch (e) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  // 🔥 LOGOUT FUNCTION
  const logout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include", // important — clears cookie
      });
    } catch (e) {
      console.error("Logout error:", e);
    }

    setUser(null); // 🔥 instantly remove user from UI
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
