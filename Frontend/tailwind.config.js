/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sfs: {
          red: '#a6140c',
          blue: '#004aad',
          white: '#ffffff',
          ink: '#0b1220',
          slate: '#334155',
          mist: '#f6f7fb',
        },
      },
      boxShadow: {
        card: '0 6px 18px rgba(15, 23, 42, 0.08)',
        sidebar: '2px 0 10px rgba(15, 23, 42, 0.06)',
      },
    },
  },
  plugins: [],
}
