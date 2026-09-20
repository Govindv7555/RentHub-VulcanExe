/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0D0D0D',
        surface: '#1A1A1A',
        surfaceLight: '#2A2A2A',
        amber: '#F5A623',
        amberHover: '#e09820',
        textMain: '#FFFFFF',
        textMuted: '#A0A0A0',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
