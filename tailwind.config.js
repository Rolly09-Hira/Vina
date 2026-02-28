/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'olive-nature': '#6B7333',
        'forest-deep': '#4E5523',
        'premium-dark': '#3E4420',
        'light-moss': '#8A9450',
        'sun-gold': '#E0B93B',
        'soft-sun': '#F3D77A',
        'warm-white': '#F2F2E9',
        'ultra-light': '#F7F8F1',
        'border-light': '#E5E7EB',
        'text-secondary': '#6B7280',
        'text-dark': '#333333',
        'sky-soft': '#87CFEA',
        'water-blue': '#2C7FB8',
        'earth-brown': '#6B4F3A',
      },
    },
  },
  plugins: [],
}