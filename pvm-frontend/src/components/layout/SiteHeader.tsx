"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { RequireRole } from "@/components/common/RequireRole";
import { Logo } from "./Logo";
import { UserMenu } from "./UserMenu";
import { PatreonButton } from "./PatreonButton";

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        "text-body transition-colors hover:text-foreground",
        isActive ? "text-foreground" : "text-muted-foreground",
      )}
    >
      {children}
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="page-container flex h-16 items-center justify-between gap-6">
        <Logo />

        <nav className="hidden items-center gap-6 sm:flex">
          <NavLink href="/mappacks">Mappacks</NavLink>
          <RequireRole role="superadmin">
            <NavLink href="/admin">Admin</NavLink>
          </RequireRole>
        </nav>

        <div className="flex items-center gap-2">
          <UserMenu />
          <PatreonButton />
        </div>
      </div>
    </header>
  );
}
