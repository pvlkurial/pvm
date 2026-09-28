"use client";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { ROLE_LABELS, ROLE_DESCRIPTIONS } from "@/constants/roles";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenu() {
  const { isAuthenticated, user, login, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Button variant="outline" loading>
        Loading...
      </Button>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Button variant="outline" onClick={login}>
        Login with Trackmania
      </Button>
    );
  }

  return (
    // Non-modal: a modal menu locks page scroll, and hiding the scrollbar
    // shifts the layout while the menu is open.
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="text-foreground">
          {user.name}
          {user.role !== "user" && (
            <Badge variant="inverse">{ROLE_LABELS[user.role]}</Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/players/${user.id}`} className="flex-col items-start gap-1">
            <span className="text-ui text-foreground">{user.name}</span>
            <span className="text-small text-muted-foreground">
              {ROLE_DESCRIPTIONS[user.role] ?? ROLE_DESCRIPTIONS.user}
            </span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={logout}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
