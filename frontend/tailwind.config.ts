import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}", // Untuk Next.js 14
  ],
  theme: {
    extend: {
      colors: {
        neon: "#a6ff4d",
        cyan: "#4dffff",
        purple: "#8f03d1",
        pink: "#c306aa",
        dark: "#202021"
      },
      fontFamily: {
        moderniz: ["Moderniz", "sans-serif"],
        eirene: ["Eirene Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
}

export default config

// /** @type {import('tailwindcss').Config} */
// module.exports = {
//     content: [
//       "./app/**/*.{js,ts,jsx,tsx}",
//       "./components/**/*.{js,ts,jsx,tsx}",
//     ],
//     darkMode: 'class',
//     theme: {
//       extend: {
//         fontFamily: {
//           sans: ['var(--font-geist-sans)'],
//           mono: ['var(--font-geist-mono)'],
//         },
//       },
//     },
//     plugins: [],
//   }