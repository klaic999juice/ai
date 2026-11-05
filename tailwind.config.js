export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 24px 55px -30px rgba(17, 17, 17, 0.18)',
      },
      colors: {
        ink: '#111111',
        mist: '#F5F5F5',
        brand: '#FFC400',
        okada: '#00A651',
      },
    },
  },
  plugins: [],
};
