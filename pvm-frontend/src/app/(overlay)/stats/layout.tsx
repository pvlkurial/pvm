import { overlayFont } from "@/fonts";

export default function StatsOverlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <span className={overlayFont.variable}>{children}</span>;
}
