module.exports = {
  darkMode: false,
  theme: {
    extend: {
      colors: {
        button: {
          primary: '#25d3d0',
          hover: '#21bcb9',
          text: '#ffffff',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  purge: [
    './views/*.html',
    './public/js/app.js',
  ],
};
