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
        serif: ['Inter', 'sans-serif'], // Replacing Italiana with Inter for the bold headings
        sans: ['Manrope', 'sans-serif'],
      },
      colors: {
        background: '#E1DED8', // Stone / Parchment (Odin's Crow)
        surface: '#D1CDC7',    // Darker Stone for interactions
        text: '#1A1918',       // Sharp Charcoal / Black
        secondary: '#4A453F',  // Dark Mineral Grey (High Contrast)
        accent: '#D94E28',     // International Orange
        subtle: '#ABA7A0',     // Darker border for inputs/subtle lines
        strong: '#1A1918',     // New: Strong border color
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
