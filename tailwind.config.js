/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        kleuro: {
          primary: "#F5A623",
          dark: "#171717",
          muted: "#6F6F6F",
          cream: "#FFF8EE",
          line: "#EFEFEF",
          card: "#FAFAFA",
        },
      },
    },
  },
  plugins: [],
};
