import type { Config } from "tailwindcss"
import tailwindAnimate from "tailwindcss-animate"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#f5f7f9",
        foreground: "#2c2f31",
        primary: {
          DEFAULT: "#702ae1",
          foreground: "#f8f0ff",
          dim: "#6411d5",
          fixed: "#b28cff",
          "fixed-dim": "#a67aff",
          container: "#b28cff",
          "on-container": "#2e006c",
        },
        secondary: {
          DEFAULT: "#b00d6a",
          foreground: "#ffeff2",
          dim: "#9d005d",
          fixed: "#ffc1d6",
          "fixed-dim": "#ffaccb",
          container: "#ffc1d6",
          "on-container": "#8e0054",
        },
        tertiary: {
          DEFAULT: "#963b64",
          dim: "#882f57",
          fixed: "#fd8eba",
          "fixed-dim": "#ed81ac",
          container: "#fd8eba",
          "on-container": "#5f0c38",
        },
        surface: {
          DEFAULT: "#f5f7f9",
          bright: "#f5f7f9",
          dim: "#d0d5d8",
          variant: "#d9dde0",
          container: "#e5e9eb",
          "container-low": "#eef1f3",
          "container-high": "#dfe3e6",
          "container-highest": "#d9dde0",
          "container-lowest": "#ffffff",
        },
        error: {
          DEFAULT: "#b41340",
          dim: "#a70138",
          container: "#f74b6d",
          "on-container": "#510017",
        },
        outline: {
          DEFAULT: "#747779",
          variant: "#abadaf",
        },
        "on-surface-variant": "#595c5e",
        "inverse-surface": "#0b0f10",
        "inverse-on-surface": "#9a9d9f",
        "inverse-primary": "#a476ff",
      },
      borderRadius: {
        lg: "2rem",
        md: "1rem",
        sm: "0.5rem",
        none: "0",
        full: "9999px",
        DEFAULT: "1rem",
      },
      fontFamily: {
        headline: ["Plus Jakarta Sans", "sans-serif"],
        body: ["Inter", "sans-serif"],
        label: ["Inter", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [tailwindAnimate],
} satisfies Config

export default config
