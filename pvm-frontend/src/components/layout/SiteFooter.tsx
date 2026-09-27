import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="page-container flex flex-wrap items-center justify-between gap-4 py-6">
        <Logo variant="footer" />
        <p className="text-small text-muted-foreground">
          {new Date().getFullYear()} PVM - Made By Laser
        </p>
      </div>
    </footer>
  );
}
