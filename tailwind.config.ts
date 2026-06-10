import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          bg: '#030305',
        },
        glass: {
          white4: 'rgba(255,255,255,0.04)',
          white8: 'rgba(255,255,255,0.08)',
          white12: 'rgba(255,255,255,0.12)',
          white20: 'rgba(255,255,255,0.20)',
        },
        accent: {
          violet: '#7c3aed',
          indigo: '#4f46e5',
        },
        node: {
          weather: '#3b82f6',
          report: '#a855f7',
          news: '#06b6d4',
          data: '#22c55e',
        },
      },
      boxShadow: {
        node: '0 0 40px rgba(124,58,237,0.12), inset 0 1px 0 rgba(255,255,255,0.06)',
        'node-hover': '0 0 60px rgba(124,58,237,0.22), inset 0 1px 0 rgba(255,255,255,0.10)',
        chat: '0 0 80px rgba(124,58,237,0.08)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        fadeIn: 'fadeIn 0.3s ease-out forwards',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
