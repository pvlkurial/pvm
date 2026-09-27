import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ExternalIconLinkProps {
  href: string;
  label: string;
  size?: "icon" | "icon-sm";
  className?: string;
  children: React.ReactNode;
}

/** An icon button that opens an external site in a new tab. */
export function ExternalIconLink({
  href,
  label,
  size = "icon",
  className,
  children,
}: ExternalIconLinkProps) {
  return (
    <Button asChild variant="outline" size={size} className={cn(className)}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        title={label}
      >
        {children}
      </a>
    </Button>
  );
}
