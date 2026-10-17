import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        md: "2rem",
        lg: "2.5rem",
      },
      screens: {
        "2xl": "76rem",
      },
    },
    extend: {
      spacing: {
        4.5: "1.125rem",
        5.5: "1.375rem",
        13: "3.25rem",
        18: "4.5rem",
      },
      colors: {
        border: "rgb(var(--border) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        sun: {
          DEFAULT: "rgb(var(--brand-sun) / <alpha-value>)",
          50: "#FFF8EB",
          100: "#FEECC6",
          200: "#FDD888",
          300: "#FBC24A",
          400: "#F5A623",
          500: "#E08B0B",
          600: "#C06D07",
          700: "#9C500A",
          800: "#7F3F10",
          900: "#6B3512",
        },
        deep: {
          DEFAULT: "rgb(var(--brand-deep) / <alpha-value>)",
          50: "#EEF3F9",
          100: "#D6E1F0",
          200: "#AEBFE0",
          300: "#7A94C7",
          400: "#4E6BAA",
          500: "#334F8C",
          600: "#243A6B",
          700: "#1A2D52",
          800: "#13223F",
          900: "#0B1F3A",
          950: "#0A1626",
        },
        energy: {
          DEFAULT: "rgb(var(--brand-green) / <alpha-value>)",
          50: "#E9F8F0",
          100: "#CFF0DF",
          200: "#A0E1C0",
          300: "#66CC9A",
          400: "#3BB77A",
          500: "#1FA463",
          600: "#178551",
          700: "#136A42",
          800: "#115436",
          900: "#0E442D",
        },
        surface: {
          DEFAULT: "rgb(var(--surface) / <alpha-value>)",
          dark: "rgb(var(--surface-dark) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-2xl": "clamp(2rem, 1.4rem + 2.4vw, 3.25rem)",
        "display-xl": "clamp(1.875rem, 1.4rem + 2vw, 2.75rem)",
        "display-lg": "clamp(1.75rem, 1.35rem + 1.6vw, 2.5rem)",
        "display-md": "clamp(1.5rem, 1.2rem + 1vw, 2rem)",
        "display-sm": "clamp(1.25rem, 1.1rem + 0.6vw, 1.625rem)",
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgb(11 31 58 / 0.08)",
        card: "0 8px 30px -6px rgb(11 31 58 / 0.1)",
        "card-hover": "0 16px 40px -8px rgb(11 31 58 / 0.16)",
        glow: "0 0 40px -8px rgb(245 166 35 / 0.45)",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgb(255 255 255 / 0.06) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.06) 1px, transparent 1px)",
        "sun-rays":
          "radial-gradient(circle at 85% 15%, rgb(245 166 35 / 0.18), transparent 45%), radial-gradient(circle at 15% 80%, rgb(31 164 99 / 0.1), transparent 40%)",
      },
      backgroundSize: {
        grid: "48px 48px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
