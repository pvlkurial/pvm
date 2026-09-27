import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Mappacks",
  description: "Every PvM mappack and campaign tracked on pvms.club.",
  path: "/mappacks",
});

export default function MappacksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
