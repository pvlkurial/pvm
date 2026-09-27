import type { Metadata } from "next";
import { siteFontVariables } from "@/fonts";

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
    <html lang="en" className={siteFontVariables}>
      <body>{children}</body>
    </html>
  );
}
