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
        shimmer: 'shimmer 4s ease-in-out infinite', // ⬅️ Slower shimmer
  },
  keyframes: {
    shimmer: {
      '0%': { backgroundPosition: '200% 0' },
      '100%': { backgroundPosition: '-200% 0' },
    },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

module.exports = config;