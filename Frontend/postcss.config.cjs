/**
 * Use the new PostCSS plugin for Tailwind.
 * After this change run: npm install --save-dev @tailwindcss/postcss
 */
module.exports = {
  plugins: [
    require('@tailwindcss/postcss'),
    require('autoprefixer'),
  ],
};
