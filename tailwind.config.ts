import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          elevated: "var(--card-elevated)",
          foreground: "var(--card-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
          text: "var(--muted-text)",
        },
        border: "var(--border)",
        input: {
          DEFAULT: "var(--input)",
          border: "var(--input-border)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          bg: "var(--destructive-bg)",
          foreground: "var(--destructive-foreground)",
        },
        success: {
          DEFAULT: "var(--success)",
          bg: "var(--success-bg)",
          foreground: "var(--success-foreground)",
        },
        warning: {
          DEFAULT: "var(--warning)",
          bg: "var(--warning-bg)",
          foreground: "var(--warning-foreground)",
        },
        ring: "var(--ring)",
        navigation: {
          DEFAULT: "var(--navigation)",
          foreground: "var(--navigation-foreground)",
          border: "var(--navigation-border)",
        },
        habit: {
          empty: "var(--habit-empty)",
          level1: "var(--habit-level-1)",
          level2: "var(--habit-level-2)",
          level3: "var(--habit-level-3)",
          level4: "var(--habit-level-4)",
          completed: "var(--habit-completed)",
          today: "var(--habit-today)",
          todayBorder: "var(--habit-today-border)",
        },
      },
      fontFamily: {
        sans: ["var(--font-ibm-arabic)", "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.75rem",
        "4xl": "2.25rem",
      },
      boxShadow: {
        'soft': '0 4px 20px -2px var(--shadow-color)',
        'soft-lg': '0 10px 30px -4px var(--shadow-color)',
        'glow': '0 0 20px -5px rgba(255, 255, 255, 0.15)',
      },
      animation: {
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeIn 0.2s ease-out',
        'check-bounce': 'checkBounce 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        scaleIn: {
          '0%': { transform: 'scale(0.92)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        checkBounce: {
          '0%': { transform: 'scale(0.8)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
