import { Casko, myCustomFont, HeatherGreen } from "@/fonts";

export default function OverlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className={`${myCustomFont.variable} ${HeatherGreen.variable} ${Casko.variable}`}>
      {children}
    </span>
  );
} 
