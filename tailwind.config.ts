import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
    "./pages/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      transitionProperty: {
        'height': 'height',
      },
      container: {
        center: true,
        padding: "1rem",
        screens: {
          "2xl": "1280px",
        },
      },
      borderRadius: {
        "2xl": "1rem",
      },
    },
  },
  darkMode: "media", // or 'class' if you prefer toggling manually
  plugins: [],
};
export default config;
