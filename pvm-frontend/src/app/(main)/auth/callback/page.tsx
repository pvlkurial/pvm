"use client";
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/authService";
import { PageStatus } from "@/components/common/PageStatus";

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

  return <PageStatus pending>Authenticating...</PageStatus>;
}

export default function CallbackPage() {
  return (
    <Suspense fallback={<PageStatus>Logging you in...</PageStatus>}>
      <CallbackContent />
    </Suspense>
  );
}
