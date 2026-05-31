import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './pages/**/*.{ts,tsx}'],
  darkMode: 'class', // app is dark-only but keep class hook
  theme: {
    extend: {
      colors: {
        ov: {
          red: '#E63946',
          'red-deep': '#B82A36',
          black: '#0D0D0D',
          bg: '#050505',
          surface: '#0F0F12',
          'surface-2': '#16161B',
          charcoal: '#1A1A2E',
          bone: '#F4F1EA',
          white: '#FFFFFF',
          fg: '#FFFFFF',
          'fg-dim': '#8A8A93',
          'fg-mute': '#5A5A63',
          hairline: '#1F1F23',
          'hairline-2': '#2A2A30',
        },
        cat: {
          valuation: '#E63946',
          'consumer-hate': '#FF8C42',
          'brand-decay': '#C77DFF',
          bags: '#FFD23F',
          'structural-decay': '#4ECDC4',
          'never-profitable': '#FF5E5B',
          undervalued: '#8AE6B4',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'Menlo', 'monospace'],
        display: ['"Archivo Narrow"', 'Impact', 'sans-serif'],
      },
      fontSize: {
        readout: ['9.5px', { letterSpacing: '0.18em' }],
        meta: ['11px', { letterSpacing: '0.04em' }],
        eyebrow: ['10px', { letterSpacing: '0.28em' }],
        hero: ['156px', { lineHeight: '0.85', letterSpacing: '-0.02em' }],
      },
      letterSpacing: {
        readout: '0.18em',
        meta: '0.22em',
        caps: '0.28em',
        display: '-0.005em',
      },
      borderRadius: {
        none: '0',
        app: '38px',
      },
      boxShadow: {
        card: '0 14px 40px rgba(0, 0, 0, 0.18)',
        doc: '0 16px 40px rgba(0, 0, 0, 0.12)',
        bear: '0 0 0 4px rgba(230, 57, 70, 0.08), 0 0 60px rgba(230, 57, 70, 0.25)',
      },
      transitionTimingFunction: {
        ov: 'cubic-bezier(0.2, 0.7, 0.3, 1)',
      },
      animation: {
        'ov-pulse': 'ov-pulse 2.2s ease-in-out infinite',
        'ov-ticker': 'ov-ticker-scroll 40s linear infinite',
        'ov-fade': 'ov-fade-in 240ms cubic-bezier(0.2, 0.7, 0.3, 1) both',
        'ov-blink': 'ov-blink 1s step-end infinite',
      },
      keyframes: {
        'ov-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 4px rgba(230,57,70,0.06), 0 0 60px rgba(230,57,70,0.20)' },
          '50%':      { boxShadow: '0 0 0 10px rgba(230,57,70,0.0),  0 0 90px rgba(230,57,70,0.45)' },
        },
        'ov-ticker-scroll': {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
        'ov-fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'ov-blink': {
          '0%, 49%':   { opacity: '1' },
          '50%, 100%': { opacity: '0.2' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
