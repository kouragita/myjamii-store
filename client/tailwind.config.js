/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Include all JavaScript and TypeScript files in the src directory
    './public/index.html', // Include the main HTML file
  ],
  theme: {
    screens: {
      'xs': '480px', // Custom breakpoint for extra small devices
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        'pitch-blue': '#1E3A8A', // Custom color for your theme
        'light-blue': '#3B82F6', // Example of another custom color
        'dark-gray': '#1F2937', // Dark gray for backgrounds
      },
      spacing: {
        '128': '32rem', // Custom spacing
        '144': '36rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out', // Custom animation
        'fade-out': 'fadeOut 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}