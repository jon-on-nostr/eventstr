// File: tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  important: '#__next',
  theme: {
    extend: {
      colors: {
        primary: {
          main: '#5E35B1',
          light: '#7E57C2',
          dark: '#4527A0',
        },
        secondary: {
          main: '#2196F3',
          light: '#64B5F6',
          dark: '#1976D2',
        },
        warning: {
          main: '#FFC107',
          light: '#FFD54F',
          dark: '#FFA000',
        },
        background: {
          default: '#F8F9FA',
          paper: '#FFFFFF',
        },
        text: {
          primary: '#212121',
          secondary: '#424242',
        },
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};