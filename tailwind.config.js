/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Two navy values carry the whole site: 500 (headings, ground, primary
        // buttons) and 700 (the one inset that needs to sit darker than a ground).
        // Add a step when a surface asks for one; an unused step is a promise the
        // design system is not keeping.
        primary: {
          500: '#0c2340',
          700: '#08182c',
        },
        // Warm accent, one hue with four jobs. 400 is the brand accent for marks,
        // rules and large numerals (3.4:1 on white, 3.1:1 on paper-2 — graphics and
        // large type only) and fills the accent button, whose label is navy (4.63:1)
        // rather than white (3.39:1, a fail). 500/600/700 carry accent text at body
        // and small sizes, 300 is the tint for labels on navy, and 50 is the light
        // wash behind one badge.
        secondary: {
          50: '#fff4ed',
          300: '#ff8a4c',
          400: '#e8621c',
          500: '#b84916',
          600: '#a53f12',
          700: '#93380f',
        },
        accent: '#a53f12',
        // Every full-bleed dark section sits on the navy itself, so the hero, page
        // headers and footer read as one surface rather than near-black.
        ground: '#0c2340',
        paper: { DEFAULT: '#ffffff', 2: '#f4f4f8' },
        ink: { DEFAULT: '#000000', muted: '#4b4b5a', faint: '#6b6b7a' },
        rule: '#e2e2ea',
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
