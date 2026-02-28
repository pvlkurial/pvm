"use client";
import { FaPatreon } from "react-icons/fa";
import { motion } from "framer-motion";
import { SiPatreon } from "react-icons/si";

interface Contributor {
  name: string;
}

const TIER_1: Contributor[] = [
  { name: "You, the player" },
];

const TIER_2: Contributor[] = [
];

const TIER_3: Contributor[] = [
];

const TIER_STYLES = [
  { color: "#FFFFFF",   shadow: "rgba(255,255,255,0.15)",  size: "text-sm" },
  { color: "#A8D8F0",   shadow: "rgba(168,216,240,0.15)",  size: "text-sm"   },
  { color: "#5EB8E8",   shadow: "rgba(94,184,232,0.12)",   size: "text-sm"   },
];

function ContributorName({
  name,
  color,
  shadow,
  size,
  delay,
}: {
  name: string;
  color: string;
  shadow: string;
  size: string;
  delay: number;
}) {
  return (
    <motion.span
      className={`text-label tracking-wide`}
      style={{ color, textShadow: `0 0 12px ${shadow}` }}
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
    >
      {name}
    </motion.span>
  );
}

export function ContributorsSection() {
  const allTiers = [TIER_1, TIER_2, TIER_3];

  return (
    <>
      <div className="border-t border-neutral-800 max-w-5xl mx-auto w-full px-6" />
      <section className="max-w-5xl mx-auto w-full px-6 py-14">
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <p className="font-ruigslay text-white text-2xl">Contributors</p>
          <SiPatreon className="text-[#FF424D]" />
          <div className="h-[3px] bg-neutral-800 " />
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-3 ml-6">
          {allTiers.map((tier, tierIdx) =>
            tier.map((contributor, i) => (
              <ContributorName
                key={`${tierIdx}-${contributor.name}`}
                name={contributor.name}
                color={TIER_STYLES[tierIdx].color}
                shadow={TIER_STYLES[tierIdx].shadow}
                size={TIER_STYLES[tierIdx].size}
                delay={(tierIdx * tier.length + i) * 0.04}
              />
            ))
          )}
        </div>
      </section>
    </>
  );
}