/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        tech: { 50: '#f0fdf4', 500: '#16a34a', 600: '#15803d', 700: '#14532d' }
      }
    }
  },
  plugins: []
}
