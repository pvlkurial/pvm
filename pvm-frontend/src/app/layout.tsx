import type { Metadata } from "next";
import { Casko, myCustomFont, HeatherGreen } from "@/fonts";
export const metadata: Metadata = {
  title: "pvms.club",
  description: "Player vs Map Tracking Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${myCustomFont.variable} ${HeatherGreen.variable} ${Casko.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
