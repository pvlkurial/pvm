import { Button } from "@/components/ui/button";

interface ExternalIconLinkProps {
  href: string;
  label: string;
  children: React.ReactNode;
}

/** An icon button that opens an external site in a new tab. */
export function ExternalIconLink({ href, label, children }: ExternalIconLinkProps) {
  return (
    <Button asChild variant="outline" size="icon">
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
