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
        '0%': { backgroundPositionX: '0%' },
        '100%': { backgroundPositionX: '100%' },
      },
    },
  },
},
  plugins: [require('@tailwindcss/typography')],
};

module.exports = config;
