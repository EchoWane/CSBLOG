/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f2f8f3',
          100: '#e6f1e8',
          200: '#cde3d2',
          300: '#a7cbb0',
          400: '#7baf89',
          500: '#559469',
          600: '#437a54',
          700: '#366144',
          800: '#2c4d37',
          900: '#23402d',
          950: '#0d1911',
        }
      },
      scale: {
        '98': '0.98',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: 'rgb(31, 41, 55)',
            lineHeight: '1.75',
            'h1, h2, h3, h4': {
              color: 'rgb(17, 24, 39)',
              fontWeight: '700',
            },
            a: {
              color: 'rgb(37, 99, 235)',
              '&:hover': {
                color: 'rgb(29, 78, 216)',
              },
            },
            code: {
              color: 'rgb(36, 41, 47)',
              backgroundColor: 'rgb(246, 248, 250)',
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
              fontWeight: '400',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              overflowX: 'auto',
              backgroundColor: 'rgb(246, 248, 250)',
              padding: '1rem',
              borderRadius: '0.5rem',
            },
            'pre code': {
              backgroundColor: 'transparent',
              color: 'inherit',
              padding: '0',
              fontSize: '0.875rem',
              lineHeight: '1.7',
            },
          },
        },
        dark: {
          css: {
            color: 'rgb(229, 231, 235)',
            'h1, h2, h3, h4': {
              color: 'rgb(243, 244, 246)',
            },
            a: {
              color: 'rgb(96, 165, 250)',
              '&:hover': {
                color: 'rgb(147, 197, 253)',
              },
            },
            code: {
              color: 'rgb(230, 237, 243)',
              backgroundColor: 'rgb(48, 54, 61)',
            },
            pre: {
              backgroundColor: 'rgb(13, 17, 23)',
            },
            'pre code': {
              backgroundColor: 'transparent',
              color: 'inherit',
            },
            blockquote: {
              color: 'rgb(229, 231, 235)',
              borderLeftColor: 'rgb(75, 85, 99)',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
