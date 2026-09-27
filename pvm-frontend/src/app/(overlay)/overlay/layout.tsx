import { overlayFont } from "@/fonts";

export default function OverlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <span className={overlayFont.variable}>{children}</span>;
}
