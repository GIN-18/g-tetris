const { addDynamicIconSelectors } = require("@iconify/tailwind");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "nes-dark": "#1E1E1E",
      },
    },
  },
  plugins: [require("@catppuccin/tailwindcss", {
    "defaultFlavour": "latte",
  }), addDynamicIconSelectors()],
};
