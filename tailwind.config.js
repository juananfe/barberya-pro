/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        barberDark: '#0a0a0a',
        barberSurface: '#161616',
        barberCard: '#1a1a1a',
        barberGold: '#d4af37',
        barberGoldLight: '#f3e5ab',
        barberGrayText: '#8a8a8a',
        barberBorder: '#2a2a2a'
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
