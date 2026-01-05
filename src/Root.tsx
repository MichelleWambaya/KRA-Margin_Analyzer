import React, { useState } from "react";
import App from "./App";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import { BusinessProfile, UserAccount } from "./types/profile";

/**
 * Lightweight, URL-based routing that keeps the main dashboard at "/"
 * and exposes optional auth/profile pages at "/auth" and "/profile".
 *
 * This ensures UI testing and direct access to the calculator are not blocked.
 */
const Root: React.FC = () => {
  const path =
    typeof window !== "undefined" ? window.location.pathname : "/";

  const [user, setUser] = useState<UserAccount | null>(null);
  const [profile, setProfile] = useState<BusinessProfile | null>(null);

  if (path.startsWith("/auth")) {
    return (
      <AuthPage
        onAuthenticated={(nextUser) => {
          setUser(nextUser);
          // Simple in-memory flow only; no redirect to keep behaviour predictable.
        }}
      />
    );
  }

  if (path.startsWith("/profile")) {
    // Fallback user label if no auth step was done.
    const effectiveUser: UserAccount =
      user ?? {
        id: "local-user",
        name: "Duka Owner",
        phone: "07xx xxx xxx",
      };

    return (
      <ProfilePage
        user={effectiveUser}
        initialProfile={profile}
        onProfileSaved={(nextProfile) => {
          setProfile(nextProfile);
          // No navigation; this page is for capturing profile only.
        }}
      />
    );
  }

  // Default: normal dashboard app at "/"
  return <App />;
};

export default Root;


