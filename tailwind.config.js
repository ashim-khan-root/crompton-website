/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Brand indigo from the client's logo (#0c0b61). 500 is the anchor; 700-900
        // are the deep surfaces used for hero and footer grounds. 50-400 are UI
        // tints only. The mark's globe is this exact colour, so headings and grounds
        // read as the same ink as the logo.
        primary: {
          50: '#f2f2f9',
          100: '#e4e4f2',
          200: '#c6c6e4',
          300: '#9d9dd1',
          400: '#6363b4',
          500: '#0c0b61',
          600: '#0a0952',
          700: '#080743',
          800: '#060534',
          900: '#05042c',
        },
        // Brand red from the logo's swoosh (#f40410). 400 is the brand value and is
        // for marks, rules and large accents only — with white text it is 4.31:1,
        // which fails AA at body size. 500 (5.50:1) is the action shade used for
        // buttons and links; 600/700 are for small text on white.
        secondary: {
          50: '#fff1f1',
          100: '#ffdcdc',
          200: '#ffb3b3',
          300: '#ff4b52',
          400: '#f40410',
          500: '#d4030f',
          600: '#b80210',
          700: '#9c020c',
          800: '#6b0209',
          900: '#3d0106',
        },
        accent: '#b80210',
        // Every full-bleed dark section (utility strip, hero, page headers, footer)
        // sits on the brand navy itself — #0c0b61 sampled from the logo's globe —
        // so the site reads as the client's colour rather than near-black. The
        // deeper end of the primary ramp is for insets inside those grounds.
        ground: '#0c0b61',
        // Cool neutrals, to sit with the indigo rather than fight it. Pure white
        // paper and true black ink; rule is the hairline.
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
