"use client";
import { motion } from "framer-motion";
import { SiPatreon } from "react-icons/si";

/** Highest tier first; each tier gets its own colour. */
const CONTRIBUTOR_TIERS = [
  { color: "#FFFFFF", names: ["Zimzalabim", "Actafabula", "SajmonOG"] },
  { color: "#A8D8F0", names: ["Loso", "Aidan", "MrSafi"] },
  { color: "#5EB8E8", names: ["You, the player"] },
];

const contributors = CONTRIBUTOR_TIERS.flatMap(({ color, names }) =>
  names.map((name) => ({ name, color })),
);

export function ContributorsSection() {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-14">
      <div className="flex items-center gap-3 border-t-2 border-border-strong pt-4">
        <h2 className="font-display text-display-m">Contributors</h2>
        <SiPatreon className="text-[#FF424D]" />
      </div>

      <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
        {contributors.map(({ name, color }, index) => (
          <motion.span
            key={name}
            className="text-body-l"
            style={{ color }}
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.04 }}
          >
            {name}
          </motion.span>
        ))}
      </div>
    </section>
  );
}
