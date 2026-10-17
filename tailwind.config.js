/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Brand navy ramp. 500 is the anchor; 700-900 are the deep surfaces
        // used for hero and footer grounds. 50-400 are UI tints only.
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#1a365d',
          600: '#1e3a5f',
          700: '#153052',
          800: '#0f2440',
          900: '#0a1929',
        },
        // Brand gold. The single accent — used for marks, rules and the
        // primary action. Never as a surface fill.
        secondary: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#d69e2e',
          500: '#b8860b',
          600: '#92400e',
          700: '#78350f',
          800: '#451a03',
          900: '#1c1006',
        },
        accent: '#2563eb',
        // Warm neutrals. Paper replaces pure white; rule is the hairline.
        paper: { DEFAULT: '#fbfaf7', 2: '#f4f1ea' },
        ink: { DEFAULT: '#141c29', muted: '#4a5568', faint: '#8c94a3' },
        rule: '#e3ded2',
      },
      fontFamily: {
        heading: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        arabic: ['Noto Sans Arabic', 'sans-serif'],
      },
      maxWidth: {
        shell: '80rem',
        measure: '42rem',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'rise': 'rise 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        rise: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
