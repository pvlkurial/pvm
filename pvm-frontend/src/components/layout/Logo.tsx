import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  /** The footer sets `.club` in the primary text colour and a smaller size. */
  variant?: "header" | "footer";
}

export function Logo({ variant = "header" }: LogoProps) {
  const isFooter = variant === "footer";

  return (
    <Link
      href="/"
      className={cn(
        "group font-logo tracking-[-0.01em] text-foreground",
        isFooter ? "text-[22px]" : "text-[28px]",
      )}
    >
      pvms
      <span
        className={cn(
          "italic transition-colors duration-300 group-hover:text-blue-300",
          isFooter ? "text-foreground" : "text-muted-foreground",
        )}
      >
        .club
      </span>
    </Link>
  );
}
