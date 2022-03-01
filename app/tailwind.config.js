module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: { black: '#191414', green: '#1db954' },
      gridTemplateColumns: {
        releases: 'repeat(auto-fill, minmax(230px, 1fr))',
      },
    },
  },
  plugins: [],
};
