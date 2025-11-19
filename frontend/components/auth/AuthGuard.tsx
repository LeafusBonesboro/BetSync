// components/auth/AuthGuard.tsx
"use client";

import { ReactNode } from "react";
import { useAuth } from "./AuthContext";

// ⚠️ IMPORTANT: point these imports to your REAL modal component paths
import LoginModal from "./LoginModal"; 
import RegisterModal from "./RegisterModal";

const AuthGuard = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return null; // optionally show a loader here

  if (!user) {
    return (
      <>
        <LoginModal />
        {/* show register only when user clicks "register" */}
        {/* <RegisterModal /> */}
      </>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
