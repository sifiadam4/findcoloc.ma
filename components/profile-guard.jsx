"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfileGuard({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [profileStatus, setProfileStatus] = useState(null);

  useEffect(() => {
    async function checkProfile() {
      // Skip check for non-authenticated users or API routes
      if (status === "loading" || !session?.user?.id) {
        setIsChecking(false);
        return;
      }

      // Skip check for public routes
      const isPublicRoute =
        pathname === "/" ||
        pathname.startsWith("/api") ||
        pathname.startsWith("/_next");

      if (isPublicRoute) {
        setIsChecking(false);
        return;
      }

      try {
        const response = await fetch("/api/user/profile-status");
        if (response.ok) {
          const data = await response.json();
          setProfileStatus(data);

          // Handle redirects based on profile completion
          const isOnboardingPage = pathname === "/onboarding";
          const isLisingsPage = pathname === "/";
          const isDashboardRoute = pathname.startsWith("/dashboard");

          if (!data.isComplete && !isOnboardingPage) {
            router.push("/onboarding");
            return;
          }


          if (data.isComplete && isOnboardingPage) {
            router.push("/");
            return;
          }
        }
      } catch (error) {
        console.error("Error checking profile status:", error);
      } finally {
        setIsChecking(false);
      }
    }

    checkProfile();
  }, [session, status, pathname, router]);

  // Show loading while checking
  if (isChecking && status !== "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return children;
}
