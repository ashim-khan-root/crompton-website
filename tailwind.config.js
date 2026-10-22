/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Navy ramp. 500 is the anchor and the ground; 700-900 are the deeper
        // insets used inside a dark section. 50-400 are UI tints only.
        primary: {
          50: '#eef2f7',
          100: '#dbe4ef',
          200: '#b7c8dd',
          300: '#8ba3c1',
          400: '#4d6d95',
          500: '#0c2340',
          600: '#0a1d36',
          700: '#08182c',
          800: '#061323',
          900: '#040e1a',
        },
        // Warm accent, one hue with three jobs. 400 is the brand accent for marks,
        // rules and large numerals (3.4:1 on white, 3.1:1 on paper-2 — graphics and
        // large type only). 500 carries white button text at 5.25:1, 600/700 are for
        // small text, and 300 is the tint used on navy, where the darker steps fall
        // below 4.5:1.
        secondary: {
          50: '#fff4ed',
          100: '#ffe3d2',
          200: '#ffc19e',
          300: '#ff8a4c',
          400: '#e8621c',
          500: '#b84916',
          600: '#a53f12',
          700: '#93380f',
          800: '#6f2a0b',
          900: '#401807',
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
