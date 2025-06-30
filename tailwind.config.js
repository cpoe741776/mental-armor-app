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
        spark: 'spark 1.5s ease-in-out infinite', // ✅ New spark animation
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        spark: {
          '0%, 100%': {
            opacity: '0.2',
            transform: 'translateY(0)',
          },
          '50%': {
            opacity: '0.7',
            transform: 'translateY(-5px)',
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

module.exports = config;