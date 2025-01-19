/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cyan: {
          500: '#00fff2',
        },
        purple: {
          500: '#ff00ff',
        },
      },
      animation: {
        'glow': 'glow 1.5s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          'from': {
            'text-shadow': '0 0 10px #00fff2, 0 0 20px #00fff2, 0 0 30px #00fff2',
          },
          'to': {
            'text-shadow': '0 0 20px #ff00ff, 0 0 30px #ff00ff, 0 0 40px #ff00ff',
          },
        },
      },
    },
  },
  plugins: [],
};