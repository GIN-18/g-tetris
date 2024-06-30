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
        "nes-blue": "#209cee",
        "nes-deep-blue": "#108de0",
        "nes-red": "#e76e55",
        "nes-deep-red": "#ce372b",
        "nes-yellow": "#f7d51d",
        "nes-deep-yellow": "#f2c409",
        "nes-green": "#92cc41",
        "nes-deep-green": "#76c442",
      },
      animation: {
        "fade-in": "fade-in 0.4s ease both",
        "fade-out": "fade-out 0.4s ease both",
        "slide-in-right": "slide-in-right 0.4s ease both",
        "slide-out-right": "slide-out-right 0.4s ease both",
        "scale-in-center": "scale-in-center 0.4s ease both",
        "scale-out-center": "scale-out-center 0.4s ease both",
        "scale-in-right": "scale-in-right 0.4s ease both",
        "scale-out-right": "scale-out-right 0.4s ease both",
      },
      keyframes: {
        "fade-in": {
          "0%": {
            opacity: "0",
          },
          to: {
            opacity: "1",
          },
        },
        "fade-out": {
          "0%": {
            opacity: "1",
          },
          to: {
            opacity: "0",
          },
        },
        "slide-in-right": {
          "0%": {
            transform: "translateX(1000px)",
            opacity: "0",
          },
          to: {
            transform: "translateX(0)",
            opacity: "1",
          },
        },
        "slide-out-right": {
          "0%": {
            transform: "translateX(0)",
            opacity: "1",
          },
          to: {
            transform: "translateX(1000px)",
            opacity: "0",
          },
        },
        "scale-in-center": {
          "0%": {
            transform: "scale(0)",
            opacity: "1",
          },
          to: {
            transform: "scale(1)",
            opacity: "1",
          },
        },
        "scale-out-center": {
          "0%": {
            transform: "scale(1)",
            opacity: "1",
          },
          to: {
            transform: "scale(0)",
            opacity: "1",
          },
        },
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
