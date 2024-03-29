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
        "nes-red": "#e76e55",
        "nes-yellow": "#f7d51d",
        "nes-green": "#92cc41",
        "nes-deep-green": "#76c442",
      },
      animation: {
        "scale-in-right": "scale-in-right 0.5s ease both",
        "scale-out-right": "scale-out-right 0.5s ease both",
      },
      keyframes: {
        "scale-in-right": {
          "0%": {
            transform: "scale(0)",
            "transform-origin": "100% 50%",
            opacity: "1",
          },
          to: {
            transform: "scale(1)",
            "transform-origin": "100% 50%",
            opacity: "1",
          },
        },
        "scale-out-right": {
          "0%": {
            transform: "scale(1)",
            "transform-origin": "100% 50%",
            opacity: "1",
          },
          to: {
            transform: "scale(0)",
            "transform-origin": "100% 50%",
            opacity: "1",
          },
        },
      },
    },
  },
  plugins: [addDynamicIconSelectors()],
};
