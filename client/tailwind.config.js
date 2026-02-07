/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        daruma: {
          red: '#E53935',
          gold: '#FFB300',
          dark: '#1a1a2e',
          darker: '#16213e',
        }
      }
    },
  },
  plugins: [],
}
