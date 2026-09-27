import "@/app/globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/** Tells search engines the site's name, which they show above results. */
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  alternateName: "Player vs Map",
  url: SITE_URL,
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <SiteHeader />
      <main className="w-full flex-1">{children}</main>
      <SiteFooter />
      {/* Only on the site itself: the OBS overlays would inflate the numbers. */}
      {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
    </AuthProvider>
  );
}
