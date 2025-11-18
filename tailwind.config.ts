import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // SmartCamp.AI Brand Colors
        brand: {
          jungle: "#1a4d2e",
          forest: "#2d6a4f",
          mint: "#52b788",
          "light-mint": "#95d5b2",
          sage: "#d8f3dc",
        },
        accent: {
          orange: "#ff9f1c",
          coral: "#ffbf69",
        },
        support: {
          "deep-blue": "#2c3e50",
          "sky-blue": "#4a90e2",
        },
        // CosmosKids Space Theme Colors
        space: {
          "deep-blue": "#0f0f23",
          "dark-blue": "#1a1a3e",
          purple: "#6b46c1",
          yellow: "#ffd700",
        },
        semantic: {
          success: "#28a745",
          warning: "#ffc107",
          error: "#dc3545",
          info: "#17a2b8",
        },
        // Neutral Colors
        white: "#ffffff",
        "off-white": "#f8f9fa",
        "light-gray": "#e9ecef",
        gray: "#6c757d",
        "dark-gray": "#343a40",
        "almost-black": "#212529",
      },
      fontFamily: {
        sans: ["Jost", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display": ["3rem", { lineHeight: "1.2", fontWeight: "700" }],
        "h1": ["2.25rem", { lineHeight: "1.3", fontWeight: "600" }],
        "h2": ["1.75rem", { lineHeight: "1.4", fontWeight: "600" }],
        "h3": ["1.375rem", { lineHeight: "1.4", fontWeight: "500" }],
        "h4": ["1.125rem", { lineHeight: "1.5", fontWeight: "500" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6", fontWeight: "400" }],
        "body": ["1rem", { lineHeight: "1.6", fontWeight: "400" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5", fontWeight: "400" }],
        "caption": ["0.75rem", { lineHeight: "1.4", fontWeight: "400" }],
      },
      spacing: {
        "xs": "0.25rem",
        "sm": "0.5rem",
        "md": "1rem",
        "lg": "1.5rem",
        "xl": "2rem",
        "2xl": "3rem",
        "3xl": "4rem",
        "4xl": "6rem",
      },
      borderRadius: {
        "sm": "0.25rem",
        "md": "0.5rem",
        "lg": "0.75rem",
        "xl": "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        "glass": "0 8px 32px rgba(0, 0, 0, 0.1)",
        "card": "0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)",
        "card-lg": "0 10px 20px rgba(0, 0, 0, 0.15), 0 6px 6px rgba(0, 0, 0, 0.1)",
      },
      backgroundImage: {
        "jungle": "url('/branding/jungle-background.png')",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
