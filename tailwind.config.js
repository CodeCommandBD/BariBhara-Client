import tailwindAnimate from "tailwindcss-animate";
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
                "inverse-surface": "#0b0f10",
                "secondary-fixed": "#ffc1d6",
                "primary-fixed": "#b28cff",
                "on-tertiary-fixed": "#37001d",
                "on-secondary-fixed": "#6b003e",
                "surface-tint": "#702ae1",
                "primary": "#702ae1",
                "secondary": "#b00d6a",
                "error": "#b41340",
                "on-secondary": "#ffeff2",
                "tertiary-fixed": "#fd8eba",
                "tertiary-container": "#fd8eba",
                "on-secondary-fixed-variant": "#9e005e",
                "error-dim": "#a70138",
                "surface-bright": "#f5f7f9",
                "on-secondary-container": "#8e0054",
                "outline": "#747779",
                "on-error-container": "#510017",
                "on-error": "#ffefef",
                "surface-container-highest": "#d9dde0",
                "primary-container": "#b28cff",
                "on-background": "hsl(var(--on-surface))",
                "on-surface-variant": "hsl(var(--on-surface-variant))",
                "background": "hsl(var(--background))",
                "surface": "hsl(var(--surface-container-lowest))",
                "on-surface": "hsl(var(--on-surface))",
                "surface-container": "hsl(var(--surface-container))",
                "surface-container-lowest": "hsl(var(--surface-container-lowest))",
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                foreground: "hsl(var(--foreground))",
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            fontFamily: {
                "headline": ["Plus Jakarta Sans"],
                "body": ["Inter"],
                "label": ["Inter"]
            },
            borderRadius: {
                "DEFAULT": "1rem",
                "lg": "2rem",
                "xl": "3rem",
                "full": "9999px"
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
};
export default config;
