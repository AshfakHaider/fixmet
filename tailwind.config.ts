import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ['var(--font-syne)', 'sans-serif'],
        geist: ['var(--font-geist)', 'sans-serif'],
      },
      colors: {
        'bg-primary': '#020818',
        'bg-secondary': '#060f2a',
        'bg-card': '#0a1535',
        'bg-card-hover': '#0d1c42',
        'accent-blue': '#2563EB',
        'accent-blue-light': '#3B82F6',
        'accent-blue-bright': '#60A5FA',
        'accent-cyan': '#06B6D4',
        'text-primary': '#F0F6FF',
        'text-secondary': '#94A3B8',
        'text-muted': '#475569',
      },
    },
  },
  plugins: [],
}
export default config
