import "@/app/globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <SiteHeader />
      <main className="w-full flex-1">{children}</main>
      <SiteFooter />
    </AuthProvider>
  );
}
