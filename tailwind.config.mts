import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        emerald: {
          600: "#1EB016",
        },
        kraRed: "#ED1C24",
      },
      borderRadius: {
        xl: "0.9rem",
        "2xl": "1.35rem",
      },
    },
  },
  plugins: [],
};

export default config;


