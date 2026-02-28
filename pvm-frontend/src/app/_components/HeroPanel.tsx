"use client";

import { useState, useEffect } from "react";

const HERO_IMAGES = [
  "https://core.trackmania.nadeo.live/maps/7669739d-a846-4869-bfe3-6a2e7c75012f/thumbnail.jpg",
  "https://core.trackmania.nadeo.live/maps/323cbe74-b262-4e8f-bd64-6a5c33aa9127/thumbnail.jpg",
];

const INTERVAL_MS = 10000;

export function HeroPanel() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % HERO_IMAGES.length);
        setVisible(true);
      }, 600);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="absolute top-0 right-0 h-full w-[55%] pointer-events-none"
      style={{ clipPath: "polygon(18% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
      aria-hidden
    >
      <img
        src={HERO_IMAGES[current]}
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
        style={{ opacity: visible ? 1 : 0 }}
      />

      {/* Left-edge fade for text readability */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: "linear-gradient(to right, rgba(10,10,10,0.7) 0%, transparent 45%)",
        }}
      />
    </div>
  );
}