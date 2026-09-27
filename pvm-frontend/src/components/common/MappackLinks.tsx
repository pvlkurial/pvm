import { FaDiscord, FaGlobe, FaTable } from "react-icons/fa6";
import { Mappack } from "@/types/mappack.types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ExternalIconLink } from "./ExternalIconLink";

interface MappackLinksProps {
  mappack: Mappack;
  /** "icon" is round icon-only buttons; "labelled" is pills with the link's name. */
  variant?: "icon" | "labelled";
  size?: "icon" | "icon-sm";
  className?: string;
}

function mappackLinks(mappack: Mappack) {
  return [
    { href: mappack.sheeturl, label: "Sheet", title: "Spreadsheet", icon: <FaTable /> },
    { href: mappack.discordurl, label: "Discord", title: "Discord", icon: <FaDiscord /> },
    { href: mappack.websiteurl, label: "Website", title: "Website", icon: <FaGlobe /> },
  ].filter((link) => link.href);
}

/** The mappack's spreadsheet, Discord and website, whichever are set. */
export function MappackLinks({
  mappack,
  variant = "icon",
  size = "icon",
  className,
}: MappackLinksProps) {
  const links = mappackLinks(mappack);
  if (links.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {links.map((link) =>
        variant === "icon" ? (
          <ExternalIconLink key={link.label} href={link.href} label={link.title} size={size}>
            {link.icon}
          </ExternalIconLink>
        ) : (
          <Button key={link.label} asChild variant="outline" size="sm">
            <a href={link.href} target="_blank" rel="noopener noreferrer">
              {link.icon}
              {link.label}
            </a>
          </Button>
        ),
      )}
    </div>
  );
}
