"use client";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import { HeroPanel } from "./_components/HeroPanel";

const AVAILABLE_STYLES = [
  { key: "tech", file: "tech.svg",  label: "Tech" },
  { key: "rpg",  file: "rpg.svg",   label: "RPG" },
];

const COMING_SOON_STYLES = [
  { key: "fullspeed", file: "fullspeed.svg", label: "Fullspeed" },
  { key: "dirt",      file: "dirt.svg",      label: "Dirt" },
];

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, login } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">

      {/* ── HERO ── */}
      <section className="relative max-w-5xl mx-auto w-full px-6 pt-28 pb-20 overflow-hidden min-h-[520px]">

        {/* Parallelogram video panel */}
        <HeroPanel />

        {/* Hero text */}
        <div className="relative z-10">
          <p className="text-neutral-500 text-xs tracking-[0.25em] uppercase mb-5">
            Trackmania · PVM Tracking Platform
          </p>

          <h1
            className="font-ruigslay leading-none mb-10"
            style={{ fontSize: "clamp(60px, 11vw, 120px)" }}
          >
            <span className="text-white block">Player</span>

            <span
              className="block"
              style={{
                WebkitTextStroke: "2px rgba(255,255,255,0.85)",
                color: "transparent",
                textShadow: "0 0 40px rgba(255,255,255,0.15)",
              }}
            >
              vs Map
            </span>
          </h1>

          <p className="text-neutral-400 text-base max-w-sm mb-10 leading-relaxed">
            Set records, earn points, and work your way through every tier.
          </p>

          <div className="flex gap-3 flex-wrap items-center">
            {!isAuthenticated ? (
              <Button
                size="lg"
                className="bg-white text-black font-semibold px-8"
                onPress={login}
              >
                Login with Trackmania
              </Button>
            ) : (
              <Button
                size="lg"
                className="bg-white text-black font-semibold px-8"
                onPress={() => router.push("/mappacks")}
              >
                View Mappacks
              </Button>
            )}
            <Button
              size="lg"
              variant="bordered"
              className="border-neutral-700 text-neutral-400 hover:text-white px-8"
              as="a"
              href="https://openplanet.dev/plugin/pvm"
              target="_blank"
            >
              Openplanet Plugin ↗
            </Button>
          </div>

          {/* ── Available PVMs ── */}
          <div className="mt-12 flex flex-wrap items-end gap-5">
            {AVAILABLE_STYLES.map((s) => (
              <div key={s.key} className="flex flex-col items-center gap-1.5">
                <Image
                  src={`/map-styles/${s.file}`}
                  alt={s.label}
                  width={32}
                  height={32}
                  className="opacity-70"
                />
                <span className="text-neutral-500 text-[10px] tracking-widest uppercase">
                  {s.label}
                </span>
              </div>
            ))}

            <div className="w-px h-8 bg-neutral-800 self-center" />

            {COMING_SOON_STYLES.map((s) => (
              <div key={s.key} className="flex flex-col items-center gap-1.5 group relative">
                <Image
                  src={`/map-styles/${s.file}`}
                  alt={s.label}
                  width={32}
                  height={32}
                  className="opacity-15"
                />
                <span className="text-neutral-700 text-[10px] tracking-widest uppercase">
                  {s.label}
                </span>
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  soon
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-neutral-800 max-w-5xl mx-auto w-full px-6" />

      {/* ── HOW IT WORKS ── */}
      <section className="max-w-5xl mx-auto w-full px-6 py-14">
        <div className="grid grid-cols-[auto_1fr] items-center gap-3 mb-8">
          <p className="font-ruigslay text-white text-2xl">How It Works</p>
          <div className="h-[3px] bg-neutral-800" />
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {[
            {
              n: "01",
              title: "Install the Plugin",
              body: "Grab the PvM plugin by Nax from Openplanet. Optional, but lets you access all maps directly in-game.",
            },
            {
              n: "02",
              title: "Login & Track Progress",
              body: "Sign in with your Trackmania account. Your PBs and achievements sync automatically.",
            },
            {
              n: "03",
              title: "Beat Time Goals",
              body: "Every track has multiple time thresholds. Hit them all to max out your points.",
            },
            {
              n: "04",
              title: "Climb the Ranks",
              body: "Accumulate points across the mappack. Earn your rank and see where you stand globally.",
            },
          ].map((step) => (
            <div
              key={step.n}
              className="bg-neutral-900 rounded-xl p-6 flex gap-5 items-start hover:bg-neutral-800 transition-colors"
            >
              <span className="font-ruigslay text-neutral-700 text-5xl leading-none select-none shrink-0">
                {step.n}
              </span>
              <div className="pt-1">
                <p className="font-ruigslay text-white text-xl mb-1.5">{step.title}</p>
                <p className="text-neutral-500 text-sm leading-relaxed">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-neutral-800 max-w-5xl mx-auto w-full px-6" />

      {/* ── BOTTOM CTA ── */}
      <section className="max-w-5xl mx-auto w-full px-6 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
          <div>
            <h2
              className="font-ruigslay text-white mb-3"
              style={{ fontSize: "clamp(38px, 6vw, 68px)", lineHeight: 1 }}
            >
              Ready to run it?
            </h2>
          </div>

          {!isAuthenticated ? (
            <Button
              size="lg"
              className="bg-white text-black font-semibold px-8 shrink-0"
              onPress={login}
            >
              Get Started
            </Button>
          ) : (
            <Button
              size="lg"
              className="bg-white text-black font-semibold px-8 shrink-0"
              onPress={() => router.push("/mappacks")}
            >
              Pick a PVM
            </Button>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      
        <p className="text-neutral-700 text-xs tracking-widest uppercase text-label ml-6 mb-6">
          Not affiliated with Nadeo
        </p>

    </div>
  );
}