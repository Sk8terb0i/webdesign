/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        text: "#fff5dc",
        background: "#2e1f39",
        primary: "#4e5f28",
        secondary: "#150c22",
        accent: "#f9bd4c",
      },
    },
  },
  plugins: [],
};
