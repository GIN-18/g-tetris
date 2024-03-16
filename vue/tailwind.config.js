const { addDynamicIconSelectors } = require("@iconify/tailwind");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "nes-gray": "#d8d8d8",
      },
    },
  },
  plugins: [
    addDynamicIconSelectors(),
  ],
};
