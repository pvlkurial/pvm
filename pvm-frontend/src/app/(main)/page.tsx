import Link from "next/link";
import { FaDiscord } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { HeroPanel } from "@/components/home/HeroPanel";
import { ContributorsSection } from "@/components/home/ContributorsSection";

const DISCORD_URL = "https://discord.gg/PbMH8BxQ3j";
const OPENPLANET_URL = "https://openplanet.dev/plugin/pvm";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-6 py-24">
        <HeroPanel />

        <div className="relative flex flex-col items-center text-center">
          <h1 className="font-display text-[clamp(56px,10vw,120px)] leading-none">
            Player <span className="italic">vs</span> Map
          </h1>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/mappacks">Mappacks</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={OPENPLANET_URL} target="_blank" rel="noopener noreferrer">
                Openplanet Plugin
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-[#5865F2] text-white hover:bg-[#5865F2]/85"
            >
              <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer">
                <FaDiscord className="size-5" />
                Discord
              </a>
            </Button>
          </div>
        </div>
      </section>

      <ContributorsSection />

      <p className="eyebrow mx-auto mb-6 w-full max-w-5xl px-6">Not affiliated with Nadeo</p>
    </div>
  );
}
