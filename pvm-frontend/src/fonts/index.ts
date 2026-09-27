import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";

export const displayFont = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
});

export const sansFont = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const monoFont = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

/** Only used by the OBS overlays, which keep their original look. */
export const overlayFont = localFont({
  src: [{ path: "./RuigslayFixed.otf", weight: "900", style: "normal" }],
  variable: "--font-my-custom",
});

export const siteFontVariables = [
  displayFont.variable,
  sansFont.variable,
  monoFont.variable,
].join(" ");
