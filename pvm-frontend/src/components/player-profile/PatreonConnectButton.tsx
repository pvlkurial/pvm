"use client";
import { useState } from "react";
import { SiPatreon } from "react-icons/si";
import { useAuth } from "@/contexts/AuthContext";
import { patreonService } from "@/services/patreon.service";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

/**
 * Links the signed-in user's Patreon profile, so supporter benefits follow
 * their pledge instead of being set by hand. Only rendered on their own profile.
 */
export function PatreonConnectButton() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) return null;

  const handleConnect = async () => {
    setIsLoading(true);
    setError(null);
    try {
      window.location.href = await patreonService.getConnectUrl();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't reach Patreon");
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await patreonService.disconnect();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to disconnect Patreon");
    } finally {
      setIsLoading(false);
    }
  };

  const isConnected = !!user.patreon_user_id;
  const status = error ?? (isConnected
    ? user.patreon_supporter
      ? "Patreon supporter"
      : "Not on the Support tier"
    : null);

  return (
    <div className="flex shrink-0 items-center gap-3">
      {status && <span className="text-small text-muted-foreground">{status}</span>}

      {isConnected ? (
        <Button variant="outline" onClick={() => setIsConfirmOpen(true)} loading={isLoading}>
          {!isLoading && <SiPatreon className="size-3.5 text-[#FF424D]" />}
          Disconnect Patreon
        </Button>
      ) : (
        <Button variant="outline" onClick={handleConnect} loading={isLoading}>
          {!isLoading && <SiPatreon className="size-3.5 text-[#FF424D]" />}
          Connect Patreon
        </Button>
      )}

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDisconnect}
        title="Disconnect Patreon?"
        message="Supporter benefits from your pledge stop until you connect again."
        confirmText="Disconnect"
        isDangerous
      />
    </div>
  );
}
