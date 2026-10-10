/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand
        ink: {
          900: '#111315',
          800: '#1A1D20',
          700: '#222629',
          600: '#2A2E32',
        },
        border: {
          DEFAULT: '#303438',
        },
        lime: {
          DEFAULT: '#C7F464',
          dark: '#A8D94A',
        },
        success: '#35B879',
        warning: '#E9AD45',
        error: '#E65A5A',
        cream: '#F5F4F0',
        'text-light': '#F8F8F6',
        'text-mute': '#A3A7AA',
      },
      fontFamily: {
        sans: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['4.5rem', { lineHeight: '1.05', fontWeight: '800' }],
        'hero': ['3.5rem', { lineHeight: '1.08', fontWeight: '800' }],
        'h1': ['2.75rem', { lineHeight: '1.1', fontWeight: '700' }],
        'h2': ['2rem', { lineHeight: '1.15', fontWeight: '700' }],
        'h3': ['1.5rem', { lineHeight: '1.2', fontWeight: '600' }],
        'h4': ['1.125rem', { lineHeight: '1.3', fontWeight: '600' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'label': ['0.75rem', { lineHeight: '1.4', fontWeight: '600' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-lime': 'pulseLime 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseLime: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
};
