/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary brand green — from Moxie business card
        brand: {
          50: '#f2f9f2',
          100: '#e0f2e1',
          200: '#c2e5c4',
          300: '#8fcf93',
          400: '#5db562',
          500: '#3d9e43',
          600: '#2d8033',
          700: '#276630',
          800: '#23512a',
          900: '#1e4325',
          DEFAULT: '#4DB6AC'
        },
        // Moxie signature teal/mint from logo
        moxie: {
          50: '#e8f8f7',
          100: '#d0f0ee',
          200: '#a3e2de',
          300: '#6dcfc9',
          400: '#4DB6AC',
          500: '#3a9e94',
          600: '#2d7d75',
          700: '#286660',
          800: '#24514d',
          900: '#1f4340',
          DEFAULT: '#4DB6AC'
        },
        // Lime green accent from card background
        lime: {
          50: '#f5f9f0',
          100: '#e8f2de',
          200: '#d2e6bc',
          300: '#b0d28f',
          400: '#8bc34a',
          500: '#7aad3a',
          600: '#5d8a2c',
          700: '#4a6d25',
          800: '#3c5620',
          900: '#33481c',
          DEFAULT: '#8bc34a'
        },
        // Dark backgrounds
        dark: {
          50: '#f0f0f0',
          100: '#d6d6d6',
          200: '#adadad',
          300: '#858585',
          400: '#5c5c5c',
          500: '#333333',
          600: '#292929',
          700: '#1f1f1f',
          800: '#141414',
          900: '#0a0a0a',
          950: '#050505',
          DEFAULT: '#1A1A1A'
        },
        stone: {
          950: '#0d0d0d'
        },
        // Off-white with green tint — from card background
        cream: '#f0f5e8',
        charcoal: '#1a1a1a'
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease forwards',
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-in': 'slideIn 0.6s ease forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scroll': 'scroll 2s ease-in-out infinite',
        'star-twinkle': 'starTwinkle 3s ease-in-out infinite'
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' }
        },
        scroll: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(12px)', opacity: '0' }
        },
        starTwinkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.3', transform: 'scale(0.8)' }
        }
      }
    }
  },
  plugins: []
}
