/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f2f8',
          100: '#cce5f1',
          200: '#99cbe3',
          300: '#66b1d5',
          400: '#3397c7',
          500: '#0f6cbf', // Moodle blue
          600: '#0c5699',
          700: '#094073',
          800: '#062b4d',
          900: '#031526',
        },
        accent: {
          50: '#f5f5f5',
          100: '#e0e0e0',
          200: '#bdbdbd',
          300: '#9e9e9e',
          400: '#757575',
          500: '#616161', // Moodle gray
          600: '#424242',
          700: '#212121',
          800: '#1a1a1a',
          900: '#0f0f0f',
        },
        moodle: {
          blue: '#0f6cbf',
          'blue-dark': '#1f4e79',
          'blue-light': '#e6f2f8',
          gray: '#f5f5f5',
          'gray-dark': '#333333',
          border: '#d0d0d0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'spin-slow': 'spin-slow 8s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'spin-slow': {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
      },
    },
  },
  plugins: [],
} 