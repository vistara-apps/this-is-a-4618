/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(210 40% 96%)',
        text: 'hsl(220 13% 13%)',
        accent: 'hsl(208 98% 50%)',
        primary: 'hsl(222 47% 11%)',
        surface: 'hsl(0 0% 100%)',
        destructive: 'hsl(354 70% 54%)',
      },
      borderRadius: {
        'xs': '4px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
      },
      boxShadow: {
        'card': '0px 4px 12px rgba(0, 0, 0, 0.08)',
        'modal': '0px 8px 24px rgba(0, 0, 0, 0.16)',
      }
    },
  },
  plugins: [],
}