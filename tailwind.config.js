/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: { 
    extend: { 
      colors: { 
        primary: '#16a34a',
        'primary-dark': '#15803d',
        'primary-light': '#22c55e',
        slate: {
          50: '#f8fafc',
          900: '#0f172a',
        }
      }, 
      borderRadius: { 
        '2xl': '1rem', 
        '3xl': '1.5rem', 
        '[20px]':'20px', 
        '[24px]':'24px', 
        '[32px]':'32px',
        '[16px]':'16px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 8px 32px rgba(0,0,0,0.06)',
        'glow': '0 0 40px rgba(22,163,74,0.15)',
      }
    } 
  },
  plugins: []
}

