/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E31E24', // Hürriyet Red
          dark: '#B71015',
          light: '#FFF0F0',
        },
        secondary: {
          blue: '#0066CC',
          green: '#4CAF50',
          dark: '#111827',
        },
        hurriyet: {
          red: '#E31E24',
          darkRed: '#B71015',
          lightRed: '#FFF0F0',
          blue: '#0066CC',
          green: '#4CAF50',
          dark: '#1A1A1A',
          muted: '#666666',
          bg: '#F8F9FA',
          border: '#E5E7EB',
          darkBg: '#0F172A',
          darkCard: '#1E293B',
          darkBorder: '#334155',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      lineHeight: {
        relaxedEditorial: '1.7',
      },
      boxShadow: {
        card: '0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 1px 4px -1px rgba(0, 0, 0, 0.03)',
        cardHover: '0 12px 24px -6px rgba(0, 0, 0, 0.1), 0 4px 8px -2px rgba(0, 0, 0, 0.06)',
      },
      animation: {
        ticker: 'ticker 30s linear infinite',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      gridTemplateColumns: {
        '15': 'repeat(15, minmax(0, 1fr))',
      },
    },
  },
  plugins: [],
};
