/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        gardenScroll: 'scrollBg 30s linear infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        scrollBg: {
          '0%': { backgroundPositionX: '0%' },
          '100%': { backgroundPositionX: '100%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

module.exports = config;