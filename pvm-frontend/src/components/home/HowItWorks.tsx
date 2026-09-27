import { SectionHeading } from "@/components/common/SectionHeading";

const STEPS = [
  {
    title: "Install the Plugin",
    body: "Grab the PvM plugin by Nax from Openplanet. Optional, but lets you access all maps directly in-game.",
  },
  {
    title: "Login & Track Progress",
    body: "Sign in with your Trackmania account. Your PBs and achievements sync automatically.",
  },
  {
    title: "Beat Time Goals",
    body: "Every track has multiple time thresholds. Hit them all to max out your points.",
  },
  {
    title: "Climb the Ranks",
    body: "Accumulate points across the mappack. Earn your rank and see where you stand globally.",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-14">
      <SectionHeading size="md">How It Works</SectionHeading>

      <ol className="mt-8 grid gap-3 sm:grid-cols-2">
        {STEPS.map((step, index) => (
          <li
            key={step.title}
            className="flex items-start gap-5 rounded-2xl border border-border bg-surface-1 p-6 transition-colors hover:bg-surface-3"
          >
            <span className="shrink-0 font-mono text-mono-s text-faint pt-2">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="mb-1.5 font-display text-title">{step.title}</p>
              <p className="text-body text-muted-foreground">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
