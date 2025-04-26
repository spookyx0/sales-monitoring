import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4CAF50',
        secondary: '#FF9800',
        neutral: '#F5F5F5',
        dark: '#212121',
        light: '#E0E0E0',
        accent: '#FF5722',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      boxShadow: {
        'custom': '0 4px 10px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};

export default config;