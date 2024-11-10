import { addDynamicIconSelectors } from '@iconify/tailwind'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    colors: {
      'nes-white': '#f8f8f8',
      'nes-black': '#212529',
      'nes-gray': '#d8d8d8',
      'nes-deep-gray': '#787878',
      'nes-blue': '#209cee',
      'nes-deep-blue': '#108de0',
      'nes-red': '#e76e55',
      'nes-deep-red': '#ce372b',
      'nes-yellow': '#f7d51d',
      'nes-deep-yellow': '#f2c409',
      'nes-green': '#92cc41',
      'nes-deep-green': '#76c442',
    },
    extend: {
      animation: {
        'fade-in': 'fade-in 0.4s ease both',
        'fade-out': 'fade-out 0.4s ease both',
      },
      keyframes: {
        'fade-in': {
          '0%': {
            opacity: '0',
          },
          to: {
            opacity: '1',
          },
        },
        'fade-out': {
          '0%': {
            opacity: '1',
          },
          to: {
            opacity: '0',
          },
        },
      },
    },
  },
  plugins: [addDynamicIconSelectors()],
}
