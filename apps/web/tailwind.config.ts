import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Black Hole Core
        void: '#000000',
        'deep-space': '#0a0a0f',
        'black-hole': '#12121a',
        'space-dust': '#1a1a2e',
        
        // Event Horizon Glow
        horizon: {
          orange: '#ff6b35',
          gold: '#ffa500',
          purple: '#9d4edd',
          blue: '#00d4ff',
          pink: '#ff006e',
        },
        
        // Cosmic
        nebula: '#7b2cbf',
        plasma: '#e040fb',
        starlight: '#f0f0ff',
        
        // Keep legacy colors for compatibility
        primary: {
          50: '#fef3f2',
          100: '#ffe4e1',
          200: '#ffccc7',
          300: '#ffa69e',
          400: '#ff6b35',
          500: '#ff6b35',
          600: '#ed4f1c',
          700: '#c73d12',
          800: '#a43514',
          900: '#883218',
          950: '#4a1507',
        },
        secondary: {
          50: '#f5f3ff',
          100: '#ede8ff',
          200: '#ddd4ff',
          300: '#c4b0ff',
          400: '#9d4edd',
          500: '#9d4edd',
          600: '#7c22ce',
          700: '#6b1aaf',
          800: '#5a178f',
          900: '#4b1575',
          950: '#2e0a4f',
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
        'gradient-primary': 'linear-gradient(135deg, #ff6b35 0%, #9d4edd 50%, #00d4ff 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0a0a0f 0%, #12121a 100%)',
        // Black hole gradient
        'black-hole': 'radial-gradient(ellipse at center, #000000 0%, #12121a 40%, #1a1a2e 70%, #0a0a0f 100%)',
        // Event horizon glow
        'event-horizon': 'conic-gradient(from 0deg, #ff6b35, #ffa500, #ff006e, #9d4edd, #00d4ff, #ff6b35)',
        // Accretion disk
        'accretion-disk': 'linear-gradient(90deg, #ff6b35 0%, #ffa500 25%, #ff006e 50%, #9d4edd 75%, #00d4ff 100%)',
      },
      boxShadow: {
        'horizon': '0 0 20px #ff6b35, 0 0 40px #ffa50080, 0 0 60px #9d4edd40',
        'horizon-sm': '0 0 10px #ff6b35, 0 0 20px #ffa50060',
        'horizon-lg': '0 0 30px #ff6b35, 0 0 60px #ffa500, 0 0 90px #9d4edd60',
        'plasma': '0 0 15px #e040fb, 0 0 30px #9d4edd80',
        'starlight': '0 0 10px #ffffff, 0 0 20px #00d4ff40',
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
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-fira-code)', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;

