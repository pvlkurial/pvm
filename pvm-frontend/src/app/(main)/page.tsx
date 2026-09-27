"use client";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { MapStyleIcon, getMapStyleLabel } from "@/components/common/MapStyleIcon";
import { HeroPanel } from "@/components/home/HeroPanel";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ContributorsSection } from "@/components/home/ContributorsSection";

const FEATURED_STYLES = ["tech", "rpg", "fullspeed", "dirt", "ice", "mixed"];

export default function HomePage() {
  const { isAuthenticated, login } = useAuth();

  return (
    <div className="flex flex-col">
      <section className="mx-auto grid w-full max-w-5xl items-center gap-12 px-6 pt-24 pb-20 md:grid-cols-[1.1fr_1fr]">
        <div>
          <h1 className="mb-10 font-display text-[clamp(64px,11vw,136px)] leading-none tracking-[-0.03em]">
            Player
            <span className="block text-muted-foreground italic">vs Map</span>
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            {isAuthenticated ? (
              <Button asChild size="lg">
                <Link href="/mappacks">View Mappacks</Link>
              </Button>
            ) : (
              <Button size="lg" onClick={login}>
                Login with Trackmania
              </Button>
            )}
            <Button asChild size="lg" variant="outline">
              <a
                href="https://openplanet.dev/plugin/pvm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Openplanet Plugin ↗
              </a>
            </Button>
          </div>

          <ul className="mt-12 flex flex-wrap items-end gap-5">
            {FEATURED_STYLES.map((style) => (
              <li key={style} className="flex flex-col items-center gap-1.5">
                <MapStyleIcon styleKey={style} className="opacity-70" />
                <span className="font-mono text-mono-s uppercase text-faint">
                  {getMapStyleLabel(style)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <HeroPanel />
      </section>

      <HowItWorks />
      <ContributorsSection />

      <p className="eyebrow mx-auto mb-6 w-full max-w-5xl px-6">
        Not affiliated with Nadeo
      </p>
    </div>
  );
}
