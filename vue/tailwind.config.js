const { addDynamicIconSelectors } = require("@iconify/tailwind");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "nes-white": "#f8f8f8",
        "nes-gray": "#d8d8d8",
        "nes-deep-gray": "#787878",
        "nes-dark": "#212529",
        "nes-green":"#58d854"
      },
    },
  },
  plugins: [addDynamicIconSelectors()],
};
