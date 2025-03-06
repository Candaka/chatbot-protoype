// client/tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#60a5fa',
          DEFAULT: '#3b82f6',
          dark: '#2563eb',
        },
        dark: {
          light: '#4b5563',
          DEFAULT: '#1f2937',
          dark: '#111827',
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}