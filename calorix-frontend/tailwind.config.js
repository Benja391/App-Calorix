/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    'fixed', 'bottom-6', 'right-6', 'z-[9999]',
    'bg-green-600', 'hover:bg-green-700',
    'text-white', 'px-6', 'py-3',
    'rounded-full', 'shadow-lg', 'transition-all',
    'text-lg', 'font-semibold'
  ]
}
