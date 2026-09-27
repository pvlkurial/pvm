import { FaDiscord, FaGlobe, FaTable } from "react-icons/fa6";
import { Mappack } from "@/types/mappack.types";
import { cn } from "@/lib/utils";
import { ExternalIconLink } from "./ExternalIconLink";

interface MappackLinksProps {
  mappack: Mappack;
  size?: "icon" | "icon-sm";
  className?: string;
}

/** The mappack's spreadsheet, Discord and website, whichever are set. */
export function MappackLinks({ mappack, size = "icon", className }: MappackLinksProps) {
  const links = [
    { href: mappack.sheeturl, label: "Spreadsheet", icon: <FaTable /> },
    { href: mappack.discordurl, label: "Discord", icon: <FaDiscord /> },
    { href: mappack.websiteurl, label: "Website", icon: <FaGlobe /> },
  ].filter((link) => link.href);

  if (links.length === 0) return null;

  return (
    <div className={cn("flex gap-2", className)}>
      {links.map((link) => (
        <ExternalIconLink key={link.label} href={link.href} label={link.label} size={size}>
          {link.icon}
        </ExternalIconLink>
      ))}
    </div>
  );
}
