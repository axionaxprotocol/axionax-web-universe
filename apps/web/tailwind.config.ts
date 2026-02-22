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
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.25' }],
        'sm': ['0.875rem', { lineHeight: '1.375' }],
        'base': ['1rem', { lineHeight: '1.6' }],
        'lg': ['1.125rem', { lineHeight: '1.5' }],
        'xl': ['1.25rem', { lineHeight: '1.4' }],
        '2xl': ['1.5rem', { lineHeight: '1.35' }],
        '3xl': ['1.875rem', { lineHeight: '1.25' }],
        '4xl': ['2.25rem', { lineHeight: '1.2' }],
        '5xl': ['3rem', { lineHeight: '1.15' }],
      },
      colors: {
        // DeAI Dark Core
        void: '#000000',
        'deep-space': '#05050A',   // Main bg
        'black-hole': '#0D0B14',   // Panel bg
        'space-dust': '#1A1625',   // Highlight bg / border

        // DeAI Glow (Neon Edition)
        horizon: {
          orange: '#FF5F56', // Red/Orange close
          gold: '#FFBD2E',   // Yellow/Gold close
          purple: '#A855F7', // Purple gradient stop
          blue: '#60A5FA',   // Blue gradient stop
          pink: '#FF7B72',   // Pink accent
        },

        // Cosmic
        nebula: '#1E3A8A',    // Dark blue border
        plasma: '#3B82F6',    // Blue accent
        starlight: '#F8F8F2', // Code / bright text

        // Semantic text (DeAI contrast)
        'text-content': '#ffffff',
        'text-muted': '#94A3B8',
        'text-accent': '#60A5FA',
        'text-accent-strong': '#A855F7',

        // Tech accent
        tech: {
          cyan: '#60A5FA',
          'cyan-hover': '#3B82F6',
          'cyan-muted': 'rgba(96, 165, 250, 0.15)',
          success: '#27C93F',
          warning: '#FFBD2E',
          error: '#FF5F56',
        },

        // Keep legacy colors for compatibility if needed
        primary: {
          50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a', 950: '#172554',
        },
        secondary: {
          50: '#faf5ff', 100: '#f3e8ff', 200: '#e9d5ff', 300: '#d8b4fe', 400: '#c084fc', 500: '#a855f7', 600: '#9333ea', 700: '#7e22ce', 800: '#6b21a8', 900: '#581c87', 950: '#3b0764',
        },
        dark: {
          50: '#f8f8ff', 100: '#f0f0ff', 200: '#e0e0f0', 300: '#c0c0d0', 400: '#8080a0', 500: '#505070', 600: '#303050', 700: '#1a1a2e', 800: '#12121a', 900: '#0a0a0f', 950: '#000000',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #60A5FA 0%, #A855F7 100%)',
        'gradient-dark': 'linear-gradient(135deg, #05050A 0%, #0D0B14 100%)',
        // Black hole gradient
        'black-hole': 'radial-gradient(ellipse at center, #000000 0%, #0D0B14 40%, #1A1625 70%, #05050A 100%)',
        // Event horizon glow
        'event-horizon': 'conic-gradient(from 0deg, #60A5FA, #A855F7, #60A5FA)',
      },
      boxShadow: {
        'panel': '0 4px 20px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        'panel-hover': '0 8px 30px rgba(96, 165, 250, 0.1), 0 0 0 1px rgba(96, 165, 250, 0.3)',
        'horizon': '0 0 20px #60A5FA, 0 0 40px rgba(168, 85, 247, 0.5), 0 0 60px rgba(96, 165, 250, 0.4)',
        'horizon-sm': '0 0 10px #60A5FA, 0 0 20px rgba(168, 85, 247, 0.3)',
        'horizon-lg': '0 0 30px #60A5FA, 0 0 60px #A855F7, 0 0 90px rgba(96, 165, 250, 0.6)',
        'plasma': '0 0 15px #A855F7, 0 0 30px rgba(168, 85, 247, 0.5)',
        'starlight': '0 0 10px #ffffff, 0 0 20px rgba(255, 255, 255, 0.4)',
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
          '0%, 100%': { boxShadow: '0 0 20px #60A5FA, 0 0 40px rgba(168, 85, 247, 0.5)' },
          '50%': { boxShadow: '0 0 30px #60A5FA, 0 0 60px #A855F7, 0 0 80px rgba(96, 165, 250, 0.6)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
