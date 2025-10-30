const {heroui} = require("@heroui/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",  // This covers src/app and everything in src
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        'bebas-neue': ['var(--font-bebas-neue)'],
        'custom': ['var(--font-my-custom)'],
        'heathergreen': ['var(--font-heathergreen)'],
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};