/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#a6ff4d',
        secondary: '#4dffff',
        accent: '#8f03d1',
        dark: '#202021',
        light: '#eef2ff',
        purple: '#c306aa',
        navy: '#0c1f6f'
      },
      fontFamily: {
        moderniz: ['Moderniz', 'sans-serif'],
        eirene: ['Eirene Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

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