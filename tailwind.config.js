/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  plugins: [],
  theme: {
    extend: {
      colors: {
        cancelGray: '#4A4A4A',
        cancelWhite: '#F4F4F4',
        delete: '#ED4C5C',
        primary: '#16ABF8',
      },
    },
  },
};
