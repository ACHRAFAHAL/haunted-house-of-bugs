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
        'spooky-purple': '#6B46C1',
        'spooky-green': '#10B981',
        'ghost-white': '#F8FAFC',
        'shadow-black': '#0F172A',
        'eerie-gray': '#1E293B',
        'mystic-blue': '#3B82F6',
      },
      fontFamily: {
        'spooky': ['Creepster', 'cursive'],
        'mono': ['Fira Code', 'Monaco', 'Consolas', 'monospace'],
      },
      animation: {
        'ghost-float': 'ghostFloat 3s ease-in-out infinite',
        'spooky-glow': 'spookyGlow 2s ease-in-out infinite alternate',
        'door-open': 'doorOpen 1s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-in forwards',
      },
      keyframes: {
        ghostFloat: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        spookyGlow: {
          '0%': { boxShadow: '0 0 5px #6B46C1' },
          '100%': { boxShadow: '0 0 20px #6B46C1, 0 0 30px #6B46C1' },
        },
        doorOpen: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(-90deg)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0px)' },
        },
      },
      backgroundImage: {
        'spooky-gradient': 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #374151 100%)',
        'haunted-pattern': "url('/images/haunted-pattern.svg')",
      },
    },
  },
  plugins: [],
}