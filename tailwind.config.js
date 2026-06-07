/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'baptistry-primary': '#1e3a5f',
        'baptistry-secondary': '#8b4513',
        'baptistry-gold': '#c5a059',
      },
    },
  },
  plugins: [],
}