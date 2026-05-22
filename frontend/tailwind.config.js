/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': 'var(--bg)',
        'bg-secondary': 'var(--surface)',
        'bg-tertiary': 'var(--surface2)',
        'border-subtle': 'var(--border)',
        'border-emphasis': 'var(--border2)',
        'text-primary': 'var(--text)',
        'text-secondary': 'var(--text2)',
        'text-tertiary': 'var(--text3)',
        'accent-emerald': 'var(--emerald)',
        'accent-amber': 'var(--amber)',
        'accent-danger': 'var(--danger)',
        'emerald-glow': 'var(--emerald-dim)',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        syne: ['"Syne"', 'sans-serif'],
      },
      borderRadius: {
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
