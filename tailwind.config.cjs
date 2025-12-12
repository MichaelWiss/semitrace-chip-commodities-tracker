/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Italiana', 'serif'],
        sans: ['Manrope', 'sans-serif'],
      },
      colors: {
        background: '#F4F1EA', // Warm Alabaster Paper
        surface: '#EAE7E0',    // Slightly darker paper
        text: '#1A1918',       // Sharp Charcoal
        secondary: '#6B665F',  // Warm Grey
        accent: '#D94E28',     // International Orange / Copper
        subtle: '#D6D3CD',     // Border color
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
