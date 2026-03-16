import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17211d",
        sand: "#f5efe5",
        ember: "#ef6f45",
        moss: "#204f3c",
        brass: "#d8a35d",
        slate: "#5e6d66",
        sky: "#dcecf2"
      },
      boxShadow: {
        panel: "0 24px 70px rgba(23, 33, 29, 0.12)"
      },
      borderRadius: {
        xl: "1.25rem",
        "2xl": "1.75rem"
      }
    }
  },
  plugins: []
};

export default config;
