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
      },
      keyframes: {
        scrollBg: {
          '0%': { backgroundPosition: '0% 100%' },
          '100%': { backgroundPosition: '100% 100%' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

module.exports = config;
