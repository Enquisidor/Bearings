/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Lora', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        parchment: {
          50:  '#f9f6f1',
          100: '#f0ebe0',
        },
        ink: {
          900: '#1a1714',
          800: '#2c2825',
          700: '#3d3833',
          600: '#5a5249',
          400: '#8c7f72',
          300: '#b0a394',
          200: '#d4c9bc',
        },
        amber: {
          warm: '#c8956a',
        }
      }
    },
  },
  plugins: [],
};
