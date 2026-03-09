import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./src/app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // TravelHub brand colors (primary)
        travelhub: {
          blue: "#003580",
          "blue-hover": "#00224f",
          "blue-light": "#0071c2",
          "blue-lighter": "#006ce4",
        },
        // Legacy alias for backward compatibility
        booking: {
          blue: "#003580",
          "blue-hover": "#00224f",
          "blue-light": "#0071c2",
          "blue-lighter": "#006ce4",
        },
        success: "#008009",
        warning: "#ff8c00",
        error: "#cc0000",
        neutral: {
          50: "#f5f5f5",
          100: "#e0e0e0",
          200: "#bdbdbd",
          300: "#9e9e9e",
          400: "#757575",
          500: "#616161",
          600: "#424242",
          700: "#333333",
          800: "#1a1a1a",
          900: "#0a0a0a",
        },
      },
      fontFamily: {
        sans: [
          "BlinkMacSystemFont",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        display: ["Space Grotesk", "IBM Plex Sans", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        "2xs": ["10px", { lineHeight: "14px" }],
        xs: ["12px", { lineHeight: "16px" }],
        sm: ["14px", { lineHeight: "20px" }],
        base: ["16px", { lineHeight: "24px" }],
        lg: ["18px", { lineHeight: "28px" }],
        xl: ["20px", { lineHeight: "28px" }],
        "2xl": ["24px", { lineHeight: "32px" }],
        "3xl": ["28px", { lineHeight: "36px" }],
        "4xl": ["32px", { lineHeight: "40px" }],
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        30: "7.5rem",
      },
      borderRadius: {
        DEFAULT: "4px",
        lg: "8px",
        xl: "12px",
        "2xl": "16px",
        "3xl": "24px",
      },
      boxShadow: {
        card: "0 2px 8px rgba(0, 0, 0, 0.1)",
        "card-hover": "0 4px 16px rgba(0, 0, 0, 0.15)",
        dropdown: "0 4px 12px rgba(0, 0, 0, 0.15)",
        modal: "0 8px 24px rgba(0, 0, 0, 0.2)",
        header: "0 2px 4px rgba(0, 0, 0, 0.1)",
      },
      maxWidth: {
        container: "1200px",
        "container-lg": "1400px",
      },
      zIndex: {
        dropdown: "1000",
        sticky: "1020",
        fixed: "1030",
        "modal-backdrop": "1040",
        modal: "1050",
        popover: "1060",
        tooltip: "1070",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "rise-in": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        "slide-up": "slide-up 0.2s ease-out",
        "slide-down": "slide-down 0.2s ease-out",
        "rise-in": "rise-in 0.5s ease-out both",
        shimmer: "shimmer 1.5s infinite linear",
      },
    },
  },
  plugins: [],
};

export default config;
