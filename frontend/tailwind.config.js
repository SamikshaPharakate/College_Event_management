/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecf3ff',
          100: '#dbe7ff',
          400: '#4cc9f0', // accent
          500: '#4c6ef5',
          600: '#4361ee', // primary
          700: '#3f37c9', // secondary
        }
      },
      boxShadow: {
        card: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
      }
    }
  },
  plugins: [],
}
