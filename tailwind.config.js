// tailwind.config.js
const {heroui} = require("@heroui/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
],
  theme: {
    extend: {
      fontFamily: {
        'bebas-neue': ['var(--font-bebas-neue)']
      }
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};