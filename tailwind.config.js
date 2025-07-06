// tailwind.config.js   (ESM style because you’re using `export default`)
export default {
  darkMode: 'class',          // ← ➊  just add this line
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
