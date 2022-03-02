module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: { black: '#191414', green: '#1db954' },
      gridTemplateColumns: {
        releases: 'repeat(auto-fill, minmax(min(180px, 100%), 1fr))',
        'releases-sm': 'repeat(auto-fill, minmax(min(150px, 100%), 1fr))',
      },
    },
  },
  plugins: [],
};
