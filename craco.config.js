/* eslint-disable */
const tailwindcss = require("tailwindcss");

module.exports = {
  style: {
    postcssOptions: {
      plugins: [tailwindcss('./tailwind.config.js'), require('autoprefixer')]
    }
  },
  // Add this ESLint configuration block
  eslint: {
    configure: (eslintConfig) => {
      // Add an override for your wordWorker.js file
      eslintConfig.overrides = [
        ...(eslintConfig.overrides || []), // Preserve any existing overrides (though unlikely in your current file)
        {
          files: ['src/pages/wordWorker.js'], // Apply this configuration ONLY to wordWorker.js
          env: {
            worker: true, // Tell ESLint this is a Web Worker environment
            browser: true // Often necessary for workers too, as they use some browser APIs (e.g., console)
          },
          rules: {
            // Turn off the no-restricted-globals rule specifically for this file
            'no-restricted-globals': 'off',
          },
        },
      ];
      return eslintConfig;
    },
  },
};