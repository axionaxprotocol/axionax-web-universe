
const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', ...fontFamily.sans],
        mono: ['var(--font-source-code-pro)', ...fontFamily.mono],
      },
      colors: {
        'axionax-background': '#121212',
        'axionax-surface': '#1E1E1E',
        'axionax-primary': '#00AEEF', // Bright Cyan/Blue
        'axionax-secondary': '#8A8A8A',
        'axionax-on-background': '#E0E0E0',
        'axionax-on-surface': '#FFFFFF',
        'axionax-gold-highlight': '#FFD700',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
