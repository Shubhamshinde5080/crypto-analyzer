/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class', // or 'media'
  theme: {
    extend: {
      colors: {
        primaryFrom: '#6A3AFF',
        primaryTo: '#41D1FF',
        surfaceLight: '#F9FAFB',
        surfaceDark: '#1F2937',
        cardLight: '#FFFFFF',
        cardDark: '#273549',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui'],
      },
      letterSpacing: {
        tighter: '-.02em',
        tight: '-.01em',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['odd', 'even', 'dark'],
      textColor: ['dark'],
    },
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@tailwindcss/forms'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@tailwindcss/typography'),
  ],
};
