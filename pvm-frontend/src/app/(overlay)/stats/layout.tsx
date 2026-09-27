import type { Metadata } from "next";
import { overlayFont } from "@/fonts";

/** OBS browser sources, not pages anyone should land on from search. */
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function StatsOverlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <span className={overlayFont.variable}>{children}</span>;
}
