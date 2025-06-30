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
        shimmer: 'shimmer 6s ease-in-out infinite',
        spark: 'spark 2s ease-in-out infinite', // Extended duration for subtle flicker
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        spark: {
          '0%, 100%': {
            opacity: '0.1',
            transform: 'translateY(0) scale(0.8)',
          },
          '50%': {
            opacity: '0.9',
            transform: 'translateY(-10px) scale(1.1)',
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

module.exports = config;