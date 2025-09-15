import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        panas: {
          bg: '#0B0F14',
          surface: '#111827',
          muted: '#1F2937',
          text: '#E5E7EB',
          subtext: '#9CA3AF',
          primary: '#D4AF37',
          accent1: '#10B981',
          accent2: '#22D3EE',
          success: '#22C55E',
          warning: '#F59E0B',
          error: '#EF4444'
        }
      },
      borderRadius: {
        lg: '16px',
        xl: '20px',
        '2xl': '24px'
      },
      boxShadow: {
        brand: '0 10px 30px rgba(212,175,55,0.12)'
      }
    }
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography'), require('@tailwindcss/aspect-ratio')]
}

export default config
