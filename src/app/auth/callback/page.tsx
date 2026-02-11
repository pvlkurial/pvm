"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/authService";
import { Spinner } from "@heroui/react";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state"); // ← Get state from URL
      const errorParam = searchParams.get("error");

      if (errorParam) {
        setError("Authentication was cancelled or failed");
        setTimeout(() => router.push("/"), 3000);
        return;
      }

      if (!code) {
        setError("No authorization code received");
        setTimeout(() => router.push("/"), 3000);
        return;
      }

      try {
        // Send both code and state to backend
        const authData = await authService.handleCallback(code, state || "");
        
        authService.saveAuth(authData);
        router.push("/");
        window.location.reload();
      } catch (err) {
        console.error("Auth callback error:", err);
        setError("Failed to complete authentication");
        setTimeout(() => router.push("/"), 3000);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 text-xl mb-4">{error}</p>
        <p className="text-white/60">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Spinner size="lg" />
      <p className="text-white mt-4">Completing authentication...</p>
    </div>
  );
}