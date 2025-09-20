import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        bg: '#FAF8F5',
        brand: {
          DEFAULT: '#79B8F3',
          50: '#EEF6FF',
          100: '#D9ECFE',
          200: '#B3D9FD',
          300: '#8CC6FB',
          400: '#66B2F7',
          500: '#79B8F3',
          600: '#4F9FEF',
          700: '#2F86E6',
          800: '#1F67BA',
          900: '#144A8F'
        },
        accent: {
          DEFAULT: '#C2410C',
          50: '#FDE8E0',
          100: '#FBD1C0',
          200: '#F6A282',
          300: '#F07543',
          400: '#DC4D1C',
          500: '#C2410C',
          600: '#9A3412',
          700: '#7C2D12',
          800: '#611E0B',
          900: '#4F1A0B'
        },
        textdark: '#0B1B22',
        surface: '#FFFFFF'
      },
      fontFamily: {
        cairo: ['Cairo', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')]
};

export default config;
