/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary BAPTISTRY colors
        'baptistry-primary': {
          light: '#1e3a5f',
          DEFAULT: '#1e3a5f',
          dark: '#3b6ea0',
        },
        'baptistry-secondary': {
          light: '#8b4513',
          DEFAULT: '#8b4513',
          dark: '#c47a42',
        },
        'baptistry-gold': {
          light: '#c5a059',
          DEFAULT: '#c5a059',
          dark: '#e0c080',
        },
        // Link colors
        link: {
          light: '#2563eb',
          dark: '#60a5fa',
        },
        // Text colors
        text: {
          light: '#1f2937',
          dark: '#e5e7eb',
        },
        // Background colors
        background: {
          light: '#f9fafb',
          dark: '#111827',
        },
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'serif': ['Georgia', 'serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};