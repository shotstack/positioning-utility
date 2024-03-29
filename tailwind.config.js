module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#25d3d0',
        button: {
          hover: '#21bcb9',
          text: '#ffffff',
        },
        link: {
          hover: '#21bcb9',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  purge: {
    enabled: true,
    content: [
      '*.html',
      'js/app.js',
    ],
  },
};
