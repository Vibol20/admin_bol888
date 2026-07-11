import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pitch: {
          950: "#060a12",
          900: "#0b1220",
          800: "#101a2c",
          700: "#182338",
          600: "#243350",
        },
        floodlight: {
          400: "#3fe0a5",
          500: "#0fbf8f",
          600: "#0a9a72",
        },
        live: {
          500: "#ff4d4d",
          600: "#e63946",
        },
        amber: {
          400: "#f7c948",
          500: "#f2b807",
        },
        mist: {
          100: "#f5f7fa",
          300: "#c7d0dd",
          500: "#94a3b8",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "floodlight-glow":
          "radial-gradient(circle at 20% 0%, rgba(15,191,143,0.18), transparent 45%), radial-gradient(circle at 85% 15%, rgba(242,184,7,0.12), transparent 40%)",
        "pitch-lines":
          "linear-gradient(180deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0,0,0,0.35)",
        glow: "0 0 0 1px rgba(15,191,143,0.25), 0 0 24px rgba(15,191,143,0.15)",
      },
      keyframes: {
        pulseLive: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(1.3)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        tickerScroll: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "pulse-live": "pulseLive 1.6s ease-in-out infinite",
        "float-slow": "floatSlow 6s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "fade-up": "fadeUp 0.5s ease-out both",
        ticker: "tickerScroll 30s linear infinite",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
