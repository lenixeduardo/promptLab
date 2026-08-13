/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        /* Poppins loaded via Google Fonts in index.html */
        sans: [
          "Poppins",
          "duolingo-sans",
          "-apple-system",
          "BlinkMacSystemFont",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        display: ["Poppins", "duolingo-sans", "sans-serif"],
        "duolingo-sans": ["Poppins", "duolingo-sans", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        pageBg: "var(--page-bg)",
        pageBgLight: "var(--page-bg-light)",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "var(--primary)",
          light: "var(--primary-light)",
          dark: "var(--primary-dark)",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "var(--muted-default)",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        emerald: "var(--emerald)",
        "emerald-dark": "var(--emerald-dark)",
        forest: "var(--forest)",
        mint: "var(--mint)",
        /* camelCase aliases (backward compat with existing components) */
        foregroundDark: "var(--foreground-dark)",
        foregroundMuted: "var(--foreground-muted)",
        foregroundSecondary: "var(--foreground-secondary)",
        foregroundTertiary: "var(--foreground-tertiary)",
        foregroundPlaceholder: "var(--foreground-placeholder)",
        /* kebab-case aliases (ZIP components) */
        "foreground-dark": "var(--foreground-dark)",
        "foreground-muted": "var(--foreground-muted)",
        "foreground-secondary": "var(--foreground-secondary)",
        "foreground-tertiary": "var(--foreground-tertiary)",
        "foreground-placeholder": "var(--foreground-placeholder)",
        "page-bg": "var(--page-bg)",
        "page-bg-light": "var(--page-bg-light)",
        stroke: {
          light: "var(--stroke-light)",
          muted: "var(--stroke-muted)",
        },
        surface: {
          soft: "var(--surface-soft)",
          success: "var(--surface-success)",
        },
        gradient: {
          mid: "var(--gradient-mid)",
          end: "var(--gradient-end)",
        },
        link: "var(--link)",
        luxury: {
          DEFAULT: "var(--luxury)",
          foreground: "var(--luxury-foreground)",
        },
        neutral: "var(--neutral)",
        /* Semantic design tokens */
        bgPrimary: "var(--bg-primary)",
        bgSecondary: "var(--bg-secondary)",
        bgCardDark: "var(--bg-card-dark)",
        textPrimary: "var(--text-primary)",
        textSecondary: "var(--text-secondary)",
        textMuted: "var(--text-muted)",
        primaryGreen: "var(--primary-green)",
        brandPurple: "var(--brand-purple)",
        brandBlue: "var(--brand-blue)",
        brandGold: "var(--brand-gold)",
        brandOrange: "var(--brand-orange)",
        "brand-purple": "var(--brand-purple)",
        "brand-blue": "var(--brand-blue)",
        "brand-gold": "var(--brand-gold)",
        "brand-orange": "var(--brand-orange)",
        statusPremium: "var(--status-premium)",
        tag: {
          bgAdvanced: "var(--tag-bg-advanced)",
          textAdvanced: "var(--tag-text-advanced)",
          bgIntermediate: "var(--tag-bg-intermediate)",
          textIntermediate: "var(--tag-text-intermediate)",
          bgBasic: "var(--tag-bg-basic)",
          textBasic: "var(--tag-text-basic)",
        },
        /* Duolingo design tokens */
        duo: {
          green: "var(--duo-brand-green)",
          "green-press": "var(--duo-green-press)",
          "green-tint": "var(--duo-pale-green-tint)",
          "green-light": "var(--duo-light-green-tint)",
          blue: "var(--duo-sky-blue)",
          "text-primary": "var(--duo-primary-text)",
          "text-muted": "var(--duo-muted-text)",
          "text-secondary": "var(--duo-secondary-text)",
          border: "var(--duo-border-subtle)",
          placeholder: "var(--duo-disabled-placeholder)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        /* Duolingo radius tokens */
        "duo-btn": "12px",
        "duo-badge": "2px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "fade-scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "flame-flicker": {
          "0%, 100%": { transform: "scaleY(1) rotate(-1deg)", opacity: "1" },
          "50%": { transform: "scaleY(1.08) rotate(1deg)", opacity: "0.9" },
        },
        "ping-slow": {
          "75%, 100%": { transform: "scale(1.8)", opacity: "0" },
        },
        "ping-slower": {
          "75%, 100%": { transform: "scale(2.4)", opacity: "0" },
        },
        "bounce-slow": {
          "0%, 100%": {
            transform: "translateY(-4px)",
            animationTimingFunction: "cubic-bezier(0.8,0,1,1)",
          },
          "50%": { transform: "translateY(0)", animationTimingFunction: "cubic-bezier(0,0,0.2,1)" },
        },
        "score-pop": {
          "0%": { transform: "scale(1)" },
          "40%": { transform: "scale(1.4)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)" },
        },
        "ring-expand": {
          "0%": { transform: "scale(0)", opacity: "0.5" },
          "100%": { transform: "scale(2)", opacity: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "scale-in": {
          from: { transform: "scale(0.85)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
        "level-badge-pop": {
          "0%": { transform: "scale(0) rotate(-20deg)", opacity: "0" },
          "60%": { transform: "scale(1.25) rotate(5deg)", opacity: "1" },
          "80%": { transform: "scale(0.92) rotate(-2deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
        },
        "unlock-slide-in": {
          from: { transform: "translateX(-20px)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "achievement-unlock": {
          "0%": { transform: "scale(1)", filter: "brightness(1)" },
          "30%": { transform: "scale(1.35)", filter: "brightness(1.3)" },
          "60%": { transform: "scale(0.92)", filter: "brightness(1.1)" },
          "80%": { transform: "scale(1.08)", filter: "brightness(1.05)" },
          "100%": { transform: "scale(1)", filter: "brightness(1)" },
        },
        "rank-entry": {
          from: { transform: "translateX(20px)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "podium-rise": {
          from: { transform: "translateY(28px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "crown-float": {
          "0%, 100%": { transform: "translateY(0) rotate(-5deg) scale(1)" },
          "25%": { transform: "translateY(-8px) rotate(4deg) scale(1.15)" },
          "75%": { transform: "translateY(-4px) rotate(-2deg) scale(1.05)" },
        },
        "top10-glow": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.01)" },
        },
        "celebration-pop": {
          "0%": { transform: "scale(0.5)", opacity: "0" },
          "70%": { transform: "scale(1.1)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "mascot-float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-scale-in": "fade-scale-in 0.2s ease-out",
        "flame-flicker": "flame-flicker 0.9s ease-in-out infinite",
        "ping-slow": "ping-slow 1.6s cubic-bezier(0,0,0.2,1) infinite",
        "ping-slower": "ping-slower 2.2s cubic-bezier(0,0,0.2,1) infinite",
        "bounce-slow": "bounce-slow 1.4s infinite",
        "score-pop": "score-pop 0.5s cubic-bezier(0.4,0,0.2,1)",
        "ring-expand": "ring-expand 0.8s ease-out forwards",
        "fade-in": "fade-in 0.25s ease-out",
        "scale-in": "scale-in 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        "level-badge-pop": "level-badge-pop 0.8s cubic-bezier(0.34,1.56,0.64,1) both",
        "unlock-slide-in": "unlock-slide-in 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
        "achievement-unlock": "achievement-unlock 0.7s cubic-bezier(0.34,1.56,0.64,1)",
        "rank-entry": "rank-entry 0.45s cubic-bezier(0.34,1.56,0.64,1) both",
        "podium-rise": "podium-rise 0.6s cubic-bezier(0.34,1.56,0.64,1) both",
        "crown-float": "crown-float 2.2s ease-in-out infinite",
        "top10-glow": "top10-glow 2s ease-in-out infinite",
        "celebration-pop": "celebration-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
        "mascot-float": "mascot-float 2.2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
