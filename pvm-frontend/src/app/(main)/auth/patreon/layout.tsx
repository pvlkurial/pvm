import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connecting Patreon",
  robots: { index: false, follow: false },
};

export default function PatreonLayout({ children }: { children: React.ReactNode }) {
  return children;
}
