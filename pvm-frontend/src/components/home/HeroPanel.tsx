"use client";
import { useState, useEffect } from "react";

const HERO_IMAGES = [
  "https://core.trackmania.nadeo.live/maps/7669739d-a846-4869-bfe3-6a2e7c75012f/thumbnail.jpg",
  "https://core.trackmania.nadeo.live/maps/323cbe74-b262-4e8f-bd64-6a5c33aa9127/thumbnail.jpg",
  "https://core.trackmania.nadeo.live/maps/d0030278-ac88-4392-91df-ce9c14024dd9/thumbnail.jpg",
  "https://core.trackmania.nadeo.live/maps/afb2d70f-120c-4c4a-8990-e7150e242dd4/thumbnail.jpg",
  "https://core.trackmania.nadeo.live/maps/c83d7f6d-7a5d-44fa-8de2-d098cc58d72c/thumbnail.jpg",
];

const INTERVAL_MS = 5000;
const FADE_MS = 600;

/** Cycles through a few track thumbnails, fading between them, as a backdrop. */
export function HeroPanel() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % HERO_IMAGES.length);
        setVisible(true);
      }, FADE_MS);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden blur" aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={HERO_IMAGES[current]}
        alt=""
        className="absolute inset-0 size-full object-cover transition-opacity duration-500"
        style={{ opacity: visible ? 0.35 : 0 }}
      />
    </div>
  );
}
