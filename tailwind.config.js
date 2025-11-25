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
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316', // 에어비앤비 코랄
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        airbnb: {
          pink: '#FF385C',
          coral: '#FF5A5F',
          light: '#FFF8F6',
          red: '#E61E4D',
          dark: '#222222',
          gray: {
            50: '#F7F7F7',
            100: '#EBEBEB',
            200: '#DDDDDD',
            300: '#B0B0B0',
            400: '#717171',
            500: '#484848',
          },
        },
      },
      boxShadow: {
        'airbnb': '0 2px 16px rgba(0, 0, 0, 0.12)',
        'airbnb-lg': '0 6px 28px rgba(0, 0, 0, 0.12)',
      },
      borderRadius: {
        'airbnb': '12px',
        'airbnb-lg': '16px',
      },
    },
  },
  plugins: [],
}

