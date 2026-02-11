"use client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@heroui/react";

interface ProtectedContentProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedContent({
  children,
  requireAdmin = false,
}: ProtectedContentProps) {
  const { isAuthenticated, user, login, isLoading } = useAuth();

  if (isLoading) {
    return <div className="text-white/60">Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="text-white/60 mb-4">Please login to view this content</p>
        <Button onClick={login} color="primary">
          Login with Trackmania
        </Button>
      </div>
    );
  }

  if (requireAdmin && user?.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="text-white/60">Admin access required</p>
      </div>
    );
  }

  return <>{children}</>;
}