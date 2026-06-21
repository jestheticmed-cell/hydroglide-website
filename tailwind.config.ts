import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f1011",
        charcoal: "#27292c",
        graphite: "#5f6368",
        mist: "#f6f5f1",
        porcelain: "#fbfbf9",
        line: "#e7e4dc"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 24px 70px rgba(15, 16, 17, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
