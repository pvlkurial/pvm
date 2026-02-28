import { MappackRank } from "@/types/mappack.types";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

interface RankDisplayProps {
  rank: MappackRank;
  nextRank?: MappackRank;
  currentPoints: number;
}

export function RankDisplay({ rank, nextRank, currentPoints }: RankDisplayProps) {
  const pointsToNext = nextRank ? nextRank.pointsNeeded - currentPoints : 0;
  const progressToNext = nextRank
    ? ((currentPoints - rank.pointsNeeded) / (nextRank.pointsNeeded - rank.pointsNeeded)) * 100
    : 100;

  const cardRef = useRef<HTMLDivElement>(null);

  // Raw mouse position values (-0.5 to 0.5 relative to card center)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for the rotation
  const springConfig = { stiffness: 200, damping: 20, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.0, 0.0], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.0, 0.0], [-5, 5]), springConfig);

  // Holographic sheen position
  const sheenX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-60, 120]), springConfig);
  const sheenY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-60, 120]), springConfig);

  // Scale up on hover
  const scale = useSpring(1, { stiffness: 300, damping: 25 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }

  function handleMouseEnter() {
    scale.set(1.08);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
    scale.set(1);
  }

  return (
    <div className="space-y-3">
      {/* 3D Rank Card */}
      <div
        style={{ perspective: "500px", perspectiveOrigin: "center" }}
        className="w-full"
      >
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            scale,
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
          className="relative rounded-xl overflow-hidden select-none"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Base card layer */}
          <div
            className="relative px-4 py-4"
            style={{
              background: `linear-gradient(135deg, ${rank.color}22 0%, #0d0d0d 60%)`,
              boxShadow: `inset 0 0 0 1px ${rank.color}40, 0 30px 80px -10px ${rank.color}40, 0 10px 30px -5px #00000080`,
            }}
          >
            {/* Ambient glow behind */}
            {rank.backgroundGlow && (
              <div
                className="absolute inset-0 blur-3xl opacity-25 pointer-events-none"
                style={{ backgroundColor: rank.color }}
              />
            )}

            {/* Holographic rainbow sheen — follows mouse */}
            <motion.div
              className="absolute inset-0 pointer-events-none rounded-xl"
              style={{
                
                mixBlendMode: "screen",
              }}
            />

            {/* Subtle diagonal gloss lines */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.04]"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  -45deg,
                  white 0px,
                  white 1px,
                  transparent 1px,
                  transparent 8px
                )`,
              }}
            />

            {/* Left color bar */}
            <div
              className="absolute left-0 top-0 bottom-0 w-[3px]"
              style={{
                background: `linear-gradient(to bottom, ${rank.color}, ${rank.color}50)`,
                boxShadow: `2px 0 12px ${rank.color}60`,
              }}
            />

            {/* Content */}
            <div className="relative z-10">
              <p className="text-[10px] tracking-widest uppercase mb-1.5 text-label">
                Current Rank
              </p>
              <p
                className="font-ruigslay leading-none"
                style={{ fontSize: "clamp(24px, 3vw, 34px)", color: rank.color }}
              >
                {rank.name}
              </p>
            </div>

            {/* Corner accent */}
            <div
              className="absolute bottom-3 right-4 opacity-20"
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: rank.color,
                filter: "blur(8px)",
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Progress to next rank */}
      {nextRank && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-neutral-500 text-[10px] tracking-widest uppercase">
              Next: {nextRank.name}
            </span>
            <span className="text-white/40 text-[10px]">
              {pointsToNext.toLocaleString()} pts
            </span>
          </div>
          <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(to right, ${nextRank.color}50, ${nextRank.color})`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progressToNext, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            />
          </div>
        </div>
      )}
    </div>
  );
}