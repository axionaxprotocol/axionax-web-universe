import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      colors: {
        // Black Hole Core
        void: '#000000',
        'deep-space': '#0a0a0f',
        'black-hole': '#12121a',
        'space-dust': '#1a1a2e',

        // Event Horizon Glow (Gold Edition)
        horizon: {
          orange: '#ff8c00', // Dark Orange
          gold: '#ffd700',   // Gold
          purple: '#b8860b', // Dark Goldenrod (replaces purple)
          blue: '#f0e68c',   // Khaki/Light Gold (replaces blue)
          pink: '#daa520',   // Goldenrod (replaces pink)
        },

        // Cosmic
        nebula: '#8b4513', // Saddle Brown
        plasma: '#cd853f', // Peru
        starlight: '#fff8dc', // Cornsilk

        // Keep legacy colors for compatibility
        primary: {
          50: '#fff8e1',
          100: '#ffecb3',
          200: '#ffe082',
          300: '#ffd54f',
          400: '#ffca28',
          500: '#ffc107',
          600: '#ffb300',
          700: '#ffa000',
          800: '#ff8f00',
          900: '#ff6f00',
          950: '#4a1507',
        },
        secondary: {
          50: '#fff3e0',
          100: '#ffe0b2',
          200: '#ffcc80',
          300: '#ffb74d',
          400: '#ffa726',
          500: '#ff9800',
          600: '#fb8c00',
          700: '#f57c00',
          800: '#ef6c00',
          900: '#e65100',
          950: '#2e0a05',
        },
        dark: {
          50: '#f8f8ff',
          100: '#f0f0ff',
          200: '#e0e0f0',
          300: '#c0c0d0',
          400: '#8080a0',
          500: '#505070',
          600: '#303050',
          700: '#1a1a2e',
          800: '#12121a',
          900: '#0a0a0f',
          950: '#000000',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #ffd700 0%, #ffa500 50%, #ff8c00 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0a0a0f 0%, #12121a 100%)',
        // Black hole gradient
        'black-hole': 'radial-gradient(ellipse at center, #000000 0%, #12121a 40%, #1a1a2e 70%, #0a0a0f 100%)',
        // Event horizon glow
        'event-horizon': 'conic-gradient(from 0deg, #ff8c00, #ffa500, #ffd700, #f0e68c, #daa520, #ff8c00)',
        // Accretion disk
        'accretion-disk': 'linear-gradient(90deg, #ff8c00 0%, #ffa500 25%, #ffd700 50%, #daa520 75%, #b8860b 100%)',
      },
      boxShadow: {
        'horizon': '0 0 20px #ff8c00, 0 0 40px #ffa50080, 0 0 60px #ffd70040',
        'horizon-sm': '0 0 10px #ff8c00, 0 0 20px #ffa50060',
        'horizon-lg': '0 0 30px #ff8c00, 0 0 60px #ffa500, 0 0 90px #ffd70060',
        'plasma': '0 0 15px #daa520, 0 0 30px #b8860b80',
        'starlight': '0 0 10px #ffffff, 0 0 20px #ffd70040',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'horizon-pulse': 'horizonPulse 3s ease-in-out infinite',
        'orbit': 'orbit 20s linear infinite',
        'twinkle': 'twinkle 2s ease-in-out infinite',
        'accretion': 'accretion 10s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        horizonPulse: {
          '0%, 100%': { boxShadow: '0 0 20px #ff6b35, 0 0 40px #ffa50080' },
          '50%': { boxShadow: '0 0 30px #ff6b35, 0 0 60px #ffa500, 0 0 80px #9d4edd60' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        accretion: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

