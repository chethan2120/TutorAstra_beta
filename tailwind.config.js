/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Strict Two Brand Colours
        brand: {
          purple: '#310064',       // Deep Purple
          'purple-dark': '#220046',
          'purple-light': '#420085',
          gold: '#F4CC45',         // Brand Gold
          'gold-light': '#F6D55E',
          'gold-dark': '#E0B52B',
        },
        // Neutral Palette
        neutral: {
          50: '#FBFBFC',
          100: '#F5F5F7',
          200: '#E5E5EB',
          300: '#D1D1DB',
          400: '#8E8E98',
          500: '#5A5A65',
          600: '#3E3E48',
          700: '#2A2A33',
          800: '#1E1E24',
          900: '#141418',
        },
        charcoal: {
          DEFAULT: '#1E1E24',
          muted: '#5A5A65',
          light: '#8E8E98',
        },
        // Backward compatibility mappings
        navy: {
          DEFAULT: '#310064',
          dark: '#220046',
          light: '#420085',
          muted: '#5A5A65',
        },
        royal: {
          DEFAULT: '#310064',
          dark: '#220046',
          light: '#420085',
        },
        gold: {
          DEFAULT: '#F4CC45',
          light: '#F6D55E',
          dark: '#E0B52B',
        },
      },
      fontFamily: {
        heading: ['Poppins', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        sans: ['Lato', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        body: ['Lato', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        'sm': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04)',
        'card': '0 2px 8px 0 rgba(49, 0, 100, 0.04)',
        'card-hover': '0 6px 18px 0 rgba(49, 0, 100, 0.08)',
      },
    },
  },
  plugins: [],
};
