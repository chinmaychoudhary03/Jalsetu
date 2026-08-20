/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        // ── JJM Water Brand ──────────────────────────────────────────
        'jal-950': '#012A4A',   // Deepest navy (text on light)
        'jal-900': '#013A63',   // Deep navy
        'jal-800': '#01497C',   // Dark blue
        'jal-700': '#014F86',   // Primary brand blue
        'jal-600': '#0353A4',   // Medium dark blue
        'jal-500': '#023E8A',   // Primary (used as 'primary' alias)
        'jal-400': '#0077B6',   // Vivid blue
        'jal-300': '#0096C7',   // Bright blue
        'jal-200': '#00B4D8',   // Cyan accent
        'jal-100': '#90E0EF',   // Light cyan
        'jal-50':  '#CAF0F8',   // Palest cyan tint

        // ── Primary alias (maps to vibrant blue) ─────────────────────
        primary: {
          DEFAULT: '#0077B6',
          50:  '#E8F6FF',
          100: '#CAF0F8',
          200: '#90E0EF',
          300: '#00B4D8',
          400: '#0096C7',
          500: '#0077B6',
          600: '#0353A4',
          700: '#023E8A',
          800: '#01497C',
          900: '#013A63',
          950: '#012A4A',
        },

        // ── Surfaces ─────────────────────────────────────────────────
        surf: {
          0: '#FFFFFF',
          1: '#F5F9FF',
          2: '#EBF4FF',
          3: '#DCE9F9',
        },

        // ── Status / semantic ────────────────────────────────────────
        ok: {
          DEFAULT: '#10B981',
          50:  '#ECFDF5',
          100: '#D1FAE5',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        },
        warn: {
          DEFAULT: '#F59E0B',
          50:  '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        crit: {
          DEFAULT: '#EF4444',
          50:  '#FEF2F2',
          100: '#FEE2E2',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
        },
        info: {
          DEFAULT: '#6366F1',
          50:  '#EEF2FF',
          100: '#E0E7FF',
          500: '#6366F1',
          600: '#4F46E5',
        },

        // ── Legacy aliases (keeps existing pages working) ─────────────
        success:    '#10B981',
        warning:    '#F59E0B',
        active:     '#0077B6',
        critical:   '#EF4444',
        background: '#F5F9FF',
        card:       '#FFFFFF',
      },

      backgroundImage: {
        'jal-gradient':       'linear-gradient(135deg, #013A63 0%, #0077B6 50%, #00B4D8 100%)',
        'jal-gradient-light': 'linear-gradient(135deg, #E8F6FF 0%, #CAF0F8 100%)',
        'card-gradient':      'linear-gradient(180deg, #FFFFFF 0%, #F5F9FF 100%)',
        'hero-gradient':      'linear-gradient(135deg, #014F86 0%, #0096C7 60%, #00B4D8 100%)',
      },

      boxShadow: {
        'card':    '0 1px 3px rgba(1,58,99,0.06), 0 4px 12px rgba(1,58,99,0.04)',
        'card-md': '0 2px 8px rgba(1,58,99,0.08), 0 8px 24px rgba(1,58,99,0.06)',
        'card-lg': '0 4px 16px rgba(1,58,99,0.10), 0 16px 40px rgba(1,58,99,0.08)',
        'nav':     '0 -4px 24px rgba(1,58,99,0.10)',
        'float':   '0 8px 32px rgba(1,58,99,0.16)',
        'glow-ok': '0 0 16px rgba(16,185,129,0.35)',
        'glow-jal':'0 0 20px rgba(0,119,182,0.30)',
      },

      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },

      animation: {
        'shimmer':      'shimmer 1.6s infinite linear',
        'slide-up':     'slideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
        'fade-in':      'fadeIn 0.25s ease-out',
        'scale-in':     'scaleIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'pulse-ring':   'pulseRing 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite',
        'count-up':     'fadeIn 0.4s ease-out',
        'bounce-in':    'bounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'check-draw':   'checkDraw 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards',
      },

      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.85)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseRing: {
          '0%':   { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(0,119,182,0.45)' },
          '70%':  { transform: 'scale(1)',    boxShadow: '0 0 0 10px rgba(0,119,182,0)' },
          '100%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(0,119,182,0)' },
        },
        bounceIn: {
          '0%':   { opacity: '0', transform: 'scale(0.3)' },
          '50%':  { opacity: '1', transform: 'scale(1.05)' },
          '70%':  { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)' },
        },
        checkDraw: {
          '0%':   { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        },
      },

      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth': 'cubic-bezier(0.32, 0.72, 0, 1)',
      },

      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
        'xs':  ['0.75rem', { lineHeight: '1.1rem' }],
        'sm':  ['0.875rem', { lineHeight: '1.25rem' }],
        'base':['1rem',    { lineHeight: '1.5rem' }],
        'lg':  ['1.125rem',{ lineHeight: '1.75rem' }],
        'xl':  ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem',  { lineHeight: '2rem' }],
        '3xl': ['1.875rem',{ lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem',    { lineHeight: '1' }],
      },

      spacing: {
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
    },
  },
  plugins: [],
}
