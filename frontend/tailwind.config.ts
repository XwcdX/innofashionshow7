// import type { Config } from 'tailwindcss'

// const config: Config = {
//   content: [
//     './src/**/*.{js,ts,jsx,tsx,mdx}',
//     './src/app/**/*.{js,ts,jsx,tsx,mdx}', // For Next.js 14
//   ],
//   theme: {
//     extend: {
//       colors: {
//         neon: '#a6ff4d',
//         cyan: '#4dffff',
//         purple: '#8f03d1',
//         pink: '#c306aa',
//         dark: '#202021',
//       },
//       fontFamily: {
//         moderniz: ['Moderniz', 'sans-serif'],
//         eirene: ['Eirene Sans', 'sans-serif'],
//       },
//       animation: {
//         'glass': 'glassAnimation 0.5s ease-in-out',
//         'blur-in': 'blurIn 0.3s ease-in-out',
//       },
//       keyframes: {
//         glassAnimation: {
//           '0%': {
//             transform: 'scale(1)',
//             opacity: '0.8',
//             backdropFilter: 'blur(0)',
//           },
//           '100%': {
//             transform: 'scale(1.05)',
//             opacity: '1',
//             backdropFilter: 'blur(10px)',  // Adding the blur effect
//           },
//         },
//         blurIn: {
//           '0%': {
//             backdropFilter: 'blur(0)',
//             transform: 'scale(1)',
//           },
//           '100%': {
//             backdropFilter: 'blur(10px)',
//             transform: 'scale(1.05)',
//           },
//         },
//       },
//     },
//   },
//   plugins: [],
// };

// export default config;


import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}', // Adjust if your Next.js app structure is different
  ],
  theme: {
    extend: {
      colors: {
        neon: '#a6ff4d',
        cyan: '#4dffff',
        purple: '#8f03d1',
        pink: '#c306aa',
        dark: '#202021', // Used for card background
      },
      fontFamily: {
        moderniz: ['Moderniz', 'sans-serif'], // Ensure these fonts are loaded in your project
        eirene: ['Eirene Sans', 'sans-serif'],
        'neue-montreal': ['"Neue Montreal"', 'sans-serif'], // Font for the section
      },
      // --- ANIMATION DEFINITIONS ---
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
            transform: 'scale(1.05)', // Scales the card up by 5%
          },
        },
        cyanGlow: {
          '0%': {
            // Start with a less intense glow or border shadow
            boxShadow: '0 0 5px rgba(77, 255, 255, 0.2)',
          },
          '100%': {
            // End with a more prominent cyan glow using your 'cyan' color
            boxShadow: '0 0 20px 5px rgba(77, 255, 255, 0.6)',
          },
        },
      },
      // --- END OF ANIMATION DEFINITIONS ---
    },
  },
  plugins: [],
};

export default config;