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
        primary: '#2563eb',
        accent: '#8b5cf6',
        surface: {
          DEFAULT: '#f9fafb',
          dark: '#1f2937',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
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
