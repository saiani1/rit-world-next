/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        profileShadow: "2px 2px 4px rgba(0, 0, 0, 0.15)"
      },
      lineClamp: {
        2: "2",
        3: "3",
      }
    },
  },
  plugins: [],
};
