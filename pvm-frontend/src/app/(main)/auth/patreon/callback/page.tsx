"use client";
import { useEffect, useRef, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/authService";
import { patreonService } from "@/services/patreon.service";
import { PageStatus } from "@/components/common/PageStatus";
import { Button } from "@/components/ui/button";

function PatreonCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [profileHref, setProfileHref] = useState("/");
  // A code can be redeemed once, so never send it twice (e.g. StrictMode re-runs).
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    // Read in the effect: localStorage does not exist while prerendering.
    const userId = authService.loadAuth()?.user.id;
    const profileHref = userId ? `/players/${userId}` : "/";
    setProfileHref(profileHref);

    const code = searchParams.get("code");
    const state = searchParams.get("state");

    // Declining on Patreon comes back with ?error=access_denied and no code.
    if (!code || !state) {
      router.replace(profileHref);
      return;
    }
    if (!userId) {
      setError("Sign in with Trackmania before connecting Patreon.");
      return;
    }

    patreonService
      .connect(code, state)
      .then(() => router.replace(profileHref))
      .catch((err) => {
        console.error("Patreon connection failed:", err);
        setError(err instanceof Error ? err.message : "Failed to connect Patreon");
      });
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
        <p className="font-display text-display-count text-muted-foreground">{error}</p>
        <Button variant="outline" asChild>
          <Link href={profileHref}>Back to profile</Link>
        </Button>
      </div>
    );
  }

  return <PageStatus pending>Connecting Patreon...</PageStatus>;
}

export default function PatreonCallbackPage() {
  return (
    <Suspense fallback={<PageStatus>Connecting Patreon...</PageStatus>}>
      <PatreonCallbackContent />
    </Suspense>
  );
}
