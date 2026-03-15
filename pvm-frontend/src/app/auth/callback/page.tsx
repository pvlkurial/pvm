"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/authService";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");

      if (!code || !state) {
        console.error("Missing code or state parameter");
        router.push("/");
        return;
      }

      try {
        const authData = await authService.handleCallback(code, state);
        authService.saveAuth(authData);
        window.dispatchEvent(new Event("auth-changed"));
        router.push("/");
        router.refresh();
      } catch (error) {
        console.error("Authentication failed:", error);
        router.push("/");
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4 font-ruigslay animate-pulse">
          Authenticating...
        </h2>
        <p className="text-label">Please wait while we log you in.</p>
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 font-ruigslay">
              Logging you in...
            </h2>
          </div>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
