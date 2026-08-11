/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './App.tsx', './index.tsx', './components/**/*.{ts,tsx}', './pages/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0071e3',
          dark: '#0068d0',
          light: '#e8f2fd',
        },
        surface: {
          DEFAULT: '#ffffff',
          secondary: '#f5f5f7',
          tertiary: '#e8e8ed',
        },
        ink: {
          DEFAULT: '#1d1d1f',
          secondary: '#6e6e73',
          tertiary: '#aeaeb2',
          quaternary: '#d2d2d7',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"',
          '"SF Pro Text"', '"Helvetica Neue"', 'Arial', 'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.10), 0 0 0 0.5px rgba(0,0,0,0.08)',
        modal: '0 24px 60px rgba(0,0,0,0.20), 0 0 0 0.5px rgba(0,0,0,0.08)',
      },
      keyframes: {
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'slide-up': 'slideUp 0.35s cubic-bezier(0.32,0.72,0,1)',
        'fade-in': 'fadeIn 0.2s ease-out',
        'fade-in-up': 'fadeInUp 0.4s cubic-bezier(0.32,0.72,0,1)',
      },
    },
  },
  plugins: [],
}
