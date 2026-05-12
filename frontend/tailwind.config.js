/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-cyan': '#00d9ff',
        'neon-purple': '#a855f7',
        'neon-pink': '#ec4899',
        'neon-green': '#22c55e',
        'gaming-dark': '#0a0e27',
        'gaming-darker': '#030812',
        'glass-light': 'rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        'gaming': ['Orbitron', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-gaming': 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #00d9ff 100%)',
        'gradient-neon': 'linear-gradient(45deg, #00d9ff, #a855f7, #ec4899)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(168, 85, 247, 0.5)',
        'glow-cyan': '0 0 30px rgba(0, 217, 255, 0.6)',
        'glow-pink': '0 0 30px rgba(236, 72, 153, 0.6)',
        'intense': '0 0 60px rgba(168, 85, 247, 0.8)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'neon-flicker': 'neon-flicker 0.15s infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 40px rgba(168, 85, 247, 0.8)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'neon-flicker': {
          '0%': { opacity: '1' },
          '19%': { opacity: '1' },
          '20%': { opacity: '0.8' },
          '24%': { opacity: '1' },
          '25%': { opacity: '0.8' },
          '54%': { opacity: '1' },
          '55%': { opacity: '0.8' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
