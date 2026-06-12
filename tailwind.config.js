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
          light: '#1e3a5f',  // Dark blue for light mode
          DEFAULT: '#1e3a5f',
          dark: '#3b6ea0',    // Lighter blue for dark mode
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
        // Link colors - consistent across modes
        link: {
          light: '#2563eb',   // Blue-600 for light mode
          dark: '#60a5fa',    // Blue-400 for dark mode
        },
        // Text colors
        text: {
          light: '#1f2937',   // Gray-800 for light mode
          dark: '#e5e7eb',    // Gray-200 for dark mode
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}