import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/views/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/contexts/**/*.{js,ts,jsx,tsx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx}",
    "./src/lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'forest': {
          DEFAULT: '#223833',
          50: '#f0f5f4',
          100: '#d9e5e2',
          200: '#b5cbc6',
          300: '#8aada5',
          400: '#648d84',
          500: '#4a726a',
          600: '#3a5b54',
          700: '#314a45',
          800: '#223833',
          900: '#1a2b27',
          950: '#0f1a17',
        },
        'sand': {
          DEFAULT: '#d1bd92',
          50: '#faf8f3',
          100: '#f4efe3',
          200: '#e8ddc6',
          300: '#d1bd92',
          400: '#c4a976',
          500: '#b8955d',
          600: '#a67d4a',
          700: '#8a643e',
          800: '#715238',
          900: '#5d4430',
          950: '#332318',
        },
        'espresso': {
          DEFAULT: '#3d1e0e',
          50: '#fdf6f3',
          100: '#fbeae3',
          200: '#f7d5c7',
          300: '#f1b8a1',
          400: '#e88f6f',
          500: '#dc6a47',
          600: '#c94d2c',
          700: '#a73d24',
          800: '#893423',
          900: '#3d1e0e',
          950: '#200f06',
        },
        background: '#faf8f3',
        foreground: '#223833',
        card: {
          DEFAULT: '#ffffff',
          foreground: '#223833'
        },
        popover: {
          DEFAULT: '#ffffff',
          foreground: '#223833'
        },
        primary: {
          DEFAULT: '#223833',
          foreground: '#faf8f3'
        },
        secondary: {
          DEFAULT: '#d1bd92',
          foreground: '#223833'
        },
        muted: {
          DEFAULT: '#f4efe3',
          foreground: '#4a726a'
        },
        accent: {
          DEFAULT: '#3d1e0e',
          foreground: '#faf8f3'
        },
        destructive: {
          DEFAULT: '#dc2626',
          foreground: '#ffffff'
        },
        border: '#e8ddc6',
        input: '#e8ddc6',
        ring: '#223833',
      },
      fontFamily: {
        'sans': ['Poppins', 'system-ui', 'sans-serif'],
        'display': ['Poppins', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: '12px',
        md: '8px',
        sm: '4px',
        xl: '16px',
        '2xl': '24px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(34, 56, 51, 0.07), 0 10px 20px -2px rgba(34, 56, 51, 0.04)',
        'card': '0 4px 25px -5px rgba(34, 56, 51, 0.1)',
        'elevated': '0 10px 40px -10px rgba(34, 56, 51, 0.15)',
      },
    }
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
