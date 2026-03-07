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
      animation: {
        'fade-in-down': 'fadeInDown 1s ease-out',
        'fade-in-up': 'fadeInUp 1s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}