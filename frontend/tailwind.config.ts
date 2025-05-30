import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        neon: '#a6ff4d',
        cyan: '#4dffff',
        purple: '#8f03d1',
        pink: '#c306aa',
        dark: '#202021',
      },
      fontFamily: {
        'moderniz': ['Moderniz', 'sans-serif'],
        'eirene': ['Eirene Sans', 'sans-serif'],
        'neue-montreal': ['"Neue Montreal"', 'sans-serif'],
        'nephilm': ['Nephilm', 'serif'],
      },
      animation: {
        'scale-up-subtle': 'scaleUpSubtle 0.3s ease-out forwards',
        'cyan-glow': 'cyanGlow 0.4s ease-out forwards',
      },
      keyframes: {
        scaleUpSubtle: {
          '0%': {
            transform: 'scale(1)',
          },
          '100%': {
            transform: 'scale(1.05)',
          },
        },
        cyanGlow: {
          '0%': {
            boxShadow: '0 0 5px rgba(77, 255, 255, 0.2)',
          },
          '100%': {
            boxShadow: '0 0 20px 5px rgba(77, 255, 255, 0.6)',
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;