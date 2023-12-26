/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Rubik: ["Rubik", "sans-serif"]
      },
      colors: {
        "moderate-blue": "#5457b6",
        "soft-red": "#ed6468",
        "light-grayish-blue": "#c3c4ef",
        "pale-red": "#ffb8bb",
        "dark-blue": "#324152",
        "grayish-blue": "#67727e",
        "light-gray": "	#eaecf1",
        "very-light-gray": "#f5f6fa"
      }
    },
  },
  plugins: [],
}

