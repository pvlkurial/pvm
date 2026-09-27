import { DM_Serif_Display, Geist, Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";

export const displayFont = DM_Serif_Display({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-dm-serif-display",
});

/** Only for the pvms.club wordmark. */
export const logoFont = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
});

export const sansFont = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

/** Only used by the OBS overlays, which keep their original look. */
export const overlayFont = localFont({
  src: [{ path: "./RuigslayFixed.otf", weight: "900", style: "normal" }],
  variable: "--font-my-custom",
});

export const siteFontVariables = [
  displayFont.variable,
  logoFont.variable,
  sansFont.variable,
].join(" ");
